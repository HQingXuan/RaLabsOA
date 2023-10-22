const UserModel = require("../models/User");

exports.getAllUsers = async () => {
  return await UserModel.find();
};

exports.createUser = async (blog) => {
  return await UserModel.create(blog);
};
exports.getUserById = async (id) => {
  return await UserModel.findById(id);
};

exports.updateUser = async (id, userData) => {
  return await UserModel.findByIdAndUpdate(id, userData, { new: true });
};


exports.deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

