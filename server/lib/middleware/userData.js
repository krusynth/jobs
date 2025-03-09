const { User, UserLevel } = require('../../models');

const userDataMiddleware = async (req,res,next) => {
  let query = {'where': {}};

  res.locals.user = false;

  try {
    if(req?.session?.passport?.user?.id) {
      const user =  await User.findOne({
        where: { id: req.session.passport.user.id },
        include: UserLevel
      });
      res.locals.user = user;
    }
  }
  catch(error) {
    console.error(error)
  }

  next();
}

module.exports = userDataMiddleware;