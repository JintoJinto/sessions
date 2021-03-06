const mat4 = require('gl-mat4')
const vec3 = require('gl-vec3')
const TAU = 6.283185307179586
const createControls = require('orbit-controls')
const createCamera = require('perspective-camera')

module.exports = function (regl) {
  const camera = createCamera({
    fov: TAU * 0.1,
    near: 0.01,
    far: 100,
    position: [0, 0, 1]
  })

  const controls = createControls({
    phi: TAU * 0.2,
    distanceBounds: [0.5, 2],
    zoomSpeed: 0.000005,
    pinchSpeed: 0.000005,
    rotateSpeed: 0.003,
    damping: 0.02,
    parent: regl._gl.canvas,
    element: regl._gl.canvas
  })

  camera.update()

  let prevTick
  function update (callback) {
    return ({tick, viewportWidth, viewportHeight}) => {
      if (tick !== prevTick) {
        controls.update()
        controls.copyInto(camera.position, camera.direction, camera.up)
        camera.viewport[2] = viewportWidth
        camera.viewport[3] = viewportHeight
        camera.update()
        prevTick = tick
      }
      return callback.apply(null, arguments)
    }
  }
  const planetTilt = mat4.rotateZ([], mat4.identity([]), TAU * 0.05)

  return regl({
    context: {
      projection: update(() => camera.projection),
      view: update(() => camera.view),
      planetTilt: planetTilt,
      planetTiltNormal: mat4.transpose([], mat4.invert([], planetTilt)),
      light1: vec3.normalize([], [-1, 0.5, 0.3])
    }
  })
}
