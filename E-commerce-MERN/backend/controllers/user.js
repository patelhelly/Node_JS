import users from "../models/user.js";
import ExpressError from "../utils/ExpressError.js";

export const createUser = async (req, res, next) => {
  const email = req.body.email;
  const findUser = await users.findOne({ email: email });
  if (!findUser) {
    const newUser = await users.create(req.body);
    res.json(newUser);
  } else {
    next(new ExpressError(400, "User Already Exists"));
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new ExpressError(401, "Invalid email or password!"));
  }
  const findUser = await users.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json(findUser);
  } else {
    next(new ExpressError(400, "User Not Found"));
  }
};
