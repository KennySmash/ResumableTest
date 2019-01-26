$(document).ready( function() {
  axios.get('/bucketStatus')
    .then(function(response){
      console.log('status GET', response);
    }).catch( function (error){
      console.error(error);
    });
});
