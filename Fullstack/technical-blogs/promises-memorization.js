// Promises from Memory


var action = function() {
  return new Promise(function(resolve, reject) {
    resolve('Did action');
  })
}


var action2 = function () {
  return new Promise(function(resolve, reject) {
    resolve('Did second action');
  })
}


var action3 = function() {
  return new Promise(function (resolve, reject) {
    resolve('Did third action');
  });
};

/* .then(cb1, cb2) takes two arguments, one for a success case and one for a failure case


*/

var p = new Promise(function(resolve, reject) {

  // do stuff

  if (resolve) {
    resolve('heres my value to return');
  } else {
    reject('error message');
  }
});




action().then(function() {
  return action2();
}).then(function() {
  return action3();
}).then(function(result) {
  console.log('done!');
});

Promise.all([action(), action2(), action3()]).then(function() {
  console.log('I am done!');
});

Promise.race([action(), action2(), action3()]).then(function() {
  console.log('one of these has finished!');
});


/* Promises can only succeed or fail once. Will not change state. You can then add
success or failure callback.This helps you react to the outcome rather than worry about timing.

Promises can be fulfilled, rejected, pending, or settled.



*/
