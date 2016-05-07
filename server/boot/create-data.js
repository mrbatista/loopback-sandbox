module.exports = function(app) {
  var Model1 = app.models.Model1;
  var now = new Date();
  var yesterday = new Date();
  yesterday = yesterday.setDate(yesterday.getDate() - 1);
  var tomorrow = new Date();
  tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
  var data = [
    {lastMessage: {created: now}, created: now},
    {lastMessage: {created: yesterday}, created: yesterday},
    {lastMessage: {created: tomorrow}, created: tomorrow}];

  Model1.create(data).then(
    function(results) {
      Model1.find({
          where: {'lastMessage.created': {lt: new Date('2016-05-07T10:57:36.717Z')}},
          'limit': 10,
          'order': 'lastMessage.created DESC'
        })
        .then(function(found) {
          console.log(found);
        })
    })
    .catch(function(err) {
      console.log(err);
    })

};
