const width = 800
const height = 600
let debug = false;


let vehicles = []
let center = new Vector2D(Math.floor(width / 2), Math.floor(height / 2))


let env = {
  foods: [],
  poisons: []
}


function setup() {
	const canvas = createCanvas(width, height)
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2)
	background(40)

  for(let i = 0; i < 200; i ++)
    vehicles.push(new Vehicle(Math.floor(Math.random() * width), Math.floor(Math.random() * height)))

  for(let i = 0; i < 50; i ++)
    env.foods.push(new Vector2D(Math.floor(Math.random() * width), Math.floor(Math.random() * height)))

  for(let i = 0; i < 50; i ++)
    env.poisons.push(new Vector2D(Math.floor(Math.random() * width), Math.floor(Math.random() * height)))

}


function draw() {
  // frameRate(1)
  background(40)

  // creating food over time
  // if(Math.random() < 0.2)
  if(env.foods.length < 50)
    env.foods.push(new Vector2D(Math.floor(Math.random() * width), Math.floor(Math.random() * height)))

  // creating food over time
  // if(Math.random() < 0.005)
  if(env.poisons.length < 50)
    env.poisons.push(new Vector2D(Math.floor(Math.random() * width), Math.floor(Math.random() * height)))

  // displaying foods
  noStroke()
  fill(0, 255, 0)
  for(let i = env.foods.length - 1; i >= 0; i --)
    circle(env.foods[i].x, env.foods[i].y, 4)

  // displaying poisons
  noStroke()
  fill(255, 0, 0)
  for(let i = env.poisons.length - 1; i >= 0; i --)
    circle(env.poisons[i].x, env.poisons[i].y, 4)


  // vehicles
  for(let i = vehicles.length - 1; i >= 0; i --) {
    vehicles[i].display()
    check_boundary(vehicles[i])

    // perceiving environment
    vehicles[i].perceive(env)
    vehicles[i].update()

    // checking if vehicle is dead
    if(vehicles[i].dead) {
      vehicles.splice(i, 1)
      continue
    }

    // reproducing a vehicle
    if((Math.random() * vehicles[i].max_hp / vehicles[i].hp) < 0.001)
      vehicles.push(vehicles[i].reproduce())

  }

  // adding new vehicle
  if(vehicles.length < 10)
    vehicles.push(new Vehicle(Math.floor(Math.random() * width), Math.floor(Math.random() * height)))
}


function check_boundary(vehicle) {
  const distance = 0
  const target = new Vector2D(Math.floor(Math.random() * width), Math.floor(Math.random() * height))

  if(vehicle.position.x < distance || vehicle.position.y < distance || vehicle.position.x > width - distance|| vehicle.position.y > height - distance) {
    const steering_force = vehicle.calc_steering_force(target)
    vehicle.apply_force(steering_force)
  }
}


function keyPressed() {
  if(key == ' ')
    debug = !debug
  else
    return
}


function constraint(value, min, max) {
  if(value < min)
    return min
  else if(value > max)
    return max
  else
    return value
}
