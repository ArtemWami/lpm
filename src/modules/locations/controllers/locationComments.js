const { Locations, ImagesForComments } = require("./../../../models");
const awsService = require('./../../../services/aws');

const locationCommentUpdate = async (req, res, successfulMessage) => {
  const { locationId } = req.params;
  const { comment } = req.body;

  // CHECK LOCATION
  const existLocation = await Locations.findOne({ where: {id: locationId} });
  if(!existLocation) return res.status(404).json({ msg: "LOCATION IS NOT EXIST" });

  // UPDATE COMMENT TO LOCATION
  await Locations.update({ comment }, { where: { id: locationId }});
  res.status(200).send({msg: successfulMessage});
}

module.exports = {
  async addComment(req, res){
    await locationCommentUpdate(req, res, "LOCATION COMMENTED");
  },

  async updateComment(req, res){
    await locationCommentUpdate(req, res, "LOCATION IS UPDATE");
  },

  async uploadToAWSBucket(req, res){
    const files = req.files;
    const uploadedInfo = files.map(async (file) => {
      const imgInfo = { fileName: file.key, imgUrl: file.location };
      const { id } = await ImagesForComments.create(imgInfo);
      imgInfo.imgId = id;
      return imgInfo;
    });

    const uploadInformation = await Promise.all(uploadedInfo);
    res.status(200).json(uploadInformation);
  },

  async joinImg(req, res) {
    const { locationId } = req.params;
    const { imgIds } = req.body;

    // CHECK LOCATIONS INFO IN DB
    const location = await Locations.findOne({ where: { id: locationId }, attributes: ['id']});
    if(!location) return res.status(400).json({ msg: "Locations IS NOT EXIST" });

    // CHECK IMAGE INFO IN DB
    const imgs = await ImagesForComments.findAll({ where: { id: imgIds.map((id) => id) }, attributes: ['id', 'fileName', 'imgUrl']});
    if(imgs.length !== imgIds.length) return res.status(400).json({ msg: "IMG IS NOT EXIST" });

    // JOIN IMG TO LOCATIONS
    imgIds.forEach((imgId) => {
      ImagesForComments.update({ locationId }, { where: { id: imgId }});
    });

    res.status(200).json({msg: `IMAGES JOIN TO JOB ${locationId}`});
  },

  async removeImg(req, res){
    const { imgId } = req.params;

    // CHECK EXIST IMG
    const img = await ImagesForComments.findOne({ where: { id: imgId }, attributes: ['id', 'fileName', 'imgUrl', 'locationId']});
    if(!img) return res.status(400).json({ msg: "IMG IS NOT EXIST" })

    // DESTROY FORM S3 AND DB
    const { id, fileName, locationId } = img;
    await ImagesForComments.destroy({ where: { id }, force: true});
    await awsService.removeImage(fileName);

    // GET ACTUAL INFO ABOUT IMAGES
    const locationImages = locationId ? await ImagesForComments.findAll({ where: { locationId }, attributes: ['id', 'fileName', 'imgUrl', 'locationId'] }) : [];

    res.status(200).json({
      msg: "IMG REMOVED. IMAGES FOR CURRENT LOCATION:",
      img: locationImages
    });
  }
};
