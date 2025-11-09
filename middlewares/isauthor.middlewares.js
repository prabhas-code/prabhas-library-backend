const isAuthor = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json("Unothorizes !- No user login");
    }
    if (req.user.role !== "author") {
      return res
        .status(401)
        .json("Unothorizes Only authors can perform this action");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

export default isAuthor;
