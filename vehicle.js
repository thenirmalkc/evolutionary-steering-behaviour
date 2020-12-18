class Vehicle {

  constructor(x, y, dna) {
    this.mass = 1
    this.max_speed = 4
    this.max_force = 0.2

    if(dna) {
      this.dna = {...dna}
      this.dna.seek_force += (Math.random() * 0.1) - 0.05
      this.dna.flee_force += (Math.random() * 0.1) - 0.05
      this.dna.seek_view_radius += Math.floor(Math.random() * 20) - 10
      this.dna.flee_view_radius += Math.floor(Math.random() * 20) - 10

      this.dna.seek_force = constraint(this.dna.seek_force, -1, 1)
      this.dna.flee_force = constraint(this.dna.seek_force, -1, 1)
      this.dna.seek_view_radius = constraint(this.dna.seek_view_radius, this.max_speed * 2, 200)
      this.dna.flee_view_radius = constraint(this.dna.flee_view_radius, this.max_speed * 2, 200)

    }
    else {
      this.dna = {
        seek_force: Math.random() * 2 - 1,
        flee_force: Math.random() * 2 - 1,
        seek_view_radius: Math.floor(Math.random() * 200 - this.max_speed * 2 - 1) + this.max_speed * 2,
        flee_view_radius: Math.floor(Math.random() * 200 - this.max_speed * 2 - 1) + this.max_speed * 2
      }
    }


    this.position = new Vector2D(x, y)
    this.velocity = Vector2D.random()
    this.acceleration = new Vector2D(0, 0)


    this.max_hp = 1
    this.min_hp = 0
    this.hp = this.max_hp

    this.dead = false
  }


  set_mass(mass) {
    this.mass = mass
  }


  // applies force
  apply_force(force) {

    // acceleration = force / mass
    this.acceleration.add(Vector2D.div(force, this.mass))
  }


  // calculates steering force
  calc_steering_force(desired_vel) {
    const steering_force = Vector2D.sub(desired_vel, this.velocity)
      .limit(this.max_force)

    return steering_force
  }


  find_nearest(array, view_radius) {
    let elem
    let index

    for(let i = 0; i < array.length; i ++)
      if(this.position.dist(array[i]) > view_radius)
        continue
      else if(!elem) {
        elem = array[i]
        index = i
      }
      else if(this.position.dist(elem) > this.position.dist(array[i])) {
        elem = array[i]
        index = i
      }

    return [elem, index]
  }


  perceive(env) {
    let [food, food_index] = this.find_nearest(env.foods, this.dna.seek_view_radius)
    let [poison, poison_index] = this.find_nearest(env.poisons, this.dna.flee_view_radius)
    let desired_vel
    let steering_force
    let distance

    if(food) {
      distance = this.position.dist(food)
      if(distance < this.max_speed) {
        env.foods.splice(food_index, 1)
        this.hp += 0.1
      }
      desired_vel = Vector2D.sub(food, this.position)
        .set_mag(this.max_speed)
      steering_force = this.calc_steering_force(desired_vel)
      this.apply_force(steering_force.mult(this.dna.seek_force))
    }

    if(poison) {
      distance = this.position.dist(poison)
      if(distance < this.max_speed) {
        env.poisons.splice(poison_index, 1)
        this.hp -= 0.2
      }
      desired_vel = Vector2D.sub(poison, this.position)
        .set_mag(this.max_speed)
        .mult(-1)
      steering_force = this.calc_steering_force(desired_vel)
      this.apply_force(steering_force.mult(this.dna.flee_force))
    }

  }

  // reproduces a vehicle with its dna
  reproduce() {
    return new Vehicle(this.position.x, this.position.y, this.dna)
  }

  // updates vehicle's velocity and position and hp
  update() {
    if(this.hp > this.max_hp)
      this.hp = this.max_hp
    else
      this.hp -= 0.002

    if(this.hp <= this.min_hp) {
      this.hp = 0
      this.dead = true
      return
    }

    // updating velocity by acceleration
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.max_speed)

    // updating position by velocity
    this.position.add(this.velocity)

    // resetting acceleration
    this.acceleration.mult(0)
  }


  // displays vehicle
  display() {

    // calculating 3 points for triangle
    const p2 = this.velocity
      .copy()
      .set_mag(10)
      .add(this.position)

    const p1 = this.velocity
      .copy()
      .set_mag(10)
      .mult(-1)
      .rotate_in_degree(20)
      .add(this.position)

    const p3 = this.velocity
      .copy()
      .set_mag(10)
      .mult(-1)
      .rotate_in_degree(-20)
      .add(this.position)

    noStroke()
    fill(lerpColor(color(255, 0, 0), color(0, 255, 0), this.hp))
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)


    if(debug) {
      // displaying food view raidus
      stroke(0, 255, 0)
      noFill()
      circle(this.position.x, this.position.y, this.dna.seek_view_radius * 2)

      // displaying poison view radius
      stroke(255, 0, 0)
      noFill()
      circle(this.position.x, this.position.y, this.dna.flee_view_radius * 2)
    }
  }
}