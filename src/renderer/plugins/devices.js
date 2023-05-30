const execute = (cmd) => {
  return new Promise((resolve, reject) => {
    require('./modules/execute')(cmd)
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}


const module = {
  start(callback) {
    execute(`adb devices`).then((res) => {
      callback(res)
    });
  }
}

export default ({ app }, inject) => {
  inject('devices', module)
}
