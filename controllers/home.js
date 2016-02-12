var HomeControllerFactory = function(){
  return {
    index: function(req, res, next){
      res.render('index');
    }
  };
};

module.exports = HomeControllerFactory;
