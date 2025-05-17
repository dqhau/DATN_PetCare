import Service from "../models/service.js";

const fetchAllService = async () => {
  try {
    const services = await Service.find({}).exec();
    return services;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default { fetchAllService };
