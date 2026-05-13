import asyncHandler from "../utils/asyncHandler";
export const getAllCakes = asyncHandler(async (req, res, next) => {
  res.send("get the call");
});

export const getOneCakeById = asyncHandler(async (req, res, next) => {
  res.send("get the call");
});

export const createCake = asyncHandler(async (req, res, next) => {
  res.send("get the call");
});

export const updateCakeInfo = asyncHandler(async (req, res, next) => {
  res.send("get the call");
});

export const deleteCakeById = asyncHandler(async (req, res, next) => {
  res.send("get the call");
});

export const deleteAllCakes = asyncHandler(async (req, res, next) => {
  res.send("get the call");
});
