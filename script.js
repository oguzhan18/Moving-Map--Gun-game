
const timestamp = () => new Date().getTime()
const sin = Math.sin
const cos = Math.cos
const log = Math.log
const KEYS = {}
const keyUpdate = e => {KEYS[e.code] = e.type === "keydown"; e.preventDefault()}
addEventListener("keydown", keyUpdate)
addEventListener("keyup", keyUpdate)
addEventListener("touchstart", e => KEYS.KeyW = true)
addEventListener("touchend",   e => KEYS.KeyW = false)
addEventListener("deviceorientation", e => pa = -e.alpha * Math.PI / 180)
const VIEW_PORT = document.getElementById('viewport')
const CTX       = viewport.getContext('2d')
const MAP_WIDTH = 16
const MAP = `
#########.......
#...............
#.......########
#..............#
#......##......#
#......##......#
#..............#
###............#
##.............#
#......####..###
#......#.......#
#......#.......#
#..............#
#......#########
#..............#
################`.replace(/\n/g, '')

const STEP_SIZE  = 0.01	 // harekt pixel
const JUMP_PIXEL = 0.80     // duvar pixel
const FOV   = Math.PI / 4
const DEPTH = 16
const SPEED = 3 // klavye hareket hızı
		let then = timestamp()
		let width, height
		let px = 14.5, py = 4, pa = 0


function update(delta) {
	CTX.clearRect(0, 0, width, height)
	if( KEYS.KeyA ) pa -= (SPEED * 0.6) * delta
	if( KEYS.KeyD ) pa += (SPEED * 0.6) * delta
	if( KEYS.KeyW || KEYS.KeyS ) {
		let i = (KEYS.KeyW) ? 1 : -1
		px += sin(pa) * SPEED * delta * i
		py += cos(pa) * SPEED * delta * i
		if (MAP[(px|0) * MAP_WIDTH + (py|0)] == '#') {
				px -= sin(pa) * SPEED * delta * i
				py -= cos(pa) * SPEED * delta * i
		}			
	}
	for (let x = 0; x < width; x += JUMP_PIXEL) {
		
			
			let rayAngle = (pa - FOV / 2) + (x / width) * FOV 	// yerden üste ışık hızı hesaplama
			let distanceToWall = 0 								// Duvar ile mesafe
			let hitWall= false	 								// duvar çarpma ve geçmeme
			let eyeX = sin(rayAngle); let eyeY = cos(rayAngle)
				while (!hitWall && distanceToWall < DEPTH) {
					distanceToWall += STEP_SIZE
					let testX = (px + eyeX * distanceToWall) |0
					let testY = (py + eyeY * distanceToWall) |0
						if (MAP[(testX|0) * MAP_WIDTH + (testY|0)] == '#') hitWall = true
				}
			let ceiling = height / 2 - height / distanceToWall
			let floor = height - ceiling
			let shade = log(DEPTH  / distanceToWall ) * 255
				CTX.strokeStyle = `rgb(${shade},${shade},${shade})`
				CTX.lineWidth   = JUMP_PIXEL
				CTX.beginPath()
				CTX.moveTo(x, ceiling)
				CTX.lineTo(x, floor)
				CTX.stroke()
	
	}

	// mini harita dolanma ve konum
	for (let ix = 0; ix < MAP_WIDTH; ix++) {
			for (let iy = 0; iy < MAP_WIDTH; iy++) {
				CTX.fillText(MAP[iy * MAP_WIDTH + ix], ix * 8 + 8, iy * 8 + 8)
			}
	}
	CTX.fillText('P', (py|0) * 8 + 8, (px|0) * 8 + 8)
}
addEventListener(
	'resize',
	(function _self(e) {
		width = viewport.width = window.innerWidth
		height = viewport.height = window.innerHeight
		CTX.textAlign = 'center'
		CTX.font = '8px Cousine'
		CTX.fillStyle = `#fff`
		return _self
	})()
);
	(function loop(){
    requestAnimationFrame(loop)
    let now = timestamp()
    let delta = now - then
    then = now
    update(delta / 1000)})()
	


	function play() {
		var audio = new Audio('https://www.fesliyanstudios.com/play-mp3/7157');
		audio.play();
	  }