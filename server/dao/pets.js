import Pet from "../models/pet.js";

// Lấy tất cả thú cưng
const fetchAllPets = async () => {
    try {
        const allPets = await Pet.find({}).exec();
        return allPets;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Lấy thú cưng theo userId
const getPetsByUserId = async (userId) => {
    try {
        const userPets = await Pet.find({ userId }).exec();
        return userPets;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Lấy thú cưng theo ID
const getPetById = async (id) => {
    try {
        const pet = await Pet.findById(id).exec();
        return pet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Xóa thú cưng
const deletePet = async (id) => {
    try {
        const deletedPet = await Pet.findByIdAndDelete(id).exec();
        return deletedPet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Lấy thú cưng mới nhất
const getLatestPets = async (limit = 4) => {
    try {
        const latestPets = await Pet.find({}).sort({ createdAt: -1 }).limit(limit).exec();
        return latestPets;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Cập nhật thú cưng
const updatePet = async (id, petData) => {
    try {
        const updatedPet = await Pet.findByIdAndUpdate(id, petData, { new: true }).exec();
        return updatedPet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Tạo thú cưng mới
const createPet = async (petData) => {
    try {
        const newPet = await Pet.create(petData);
        return newPet;
    } catch (error) {
        throw new Error(error.toString());
    }
};

export default {
    fetchAllPets,
    getPetsByUserId,
    getPetById,
    deletePet,
    getLatestPets,
    updatePet,
    createPet
}
