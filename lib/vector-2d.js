const UNIT_RADIAN_IN_DEGREE = 57.2958
const UNIT_DEGREE_IN_RADIAN = 0.0174533


class Vector2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  copy() {
    return new Vector2D(this.x, this.y)
  }

  set_x(x) {
    this.x = x
    return this
  }

  set_y(y) {
    this.y = y
    return this
  }

  set(x, y) {
    return this.set_x(x)
      .set_y(y)
  }

  add(vector) {
    this.x += vector.x
    this.y += vector.y
    return this
  }

  sub(vector) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }

  mult(scalar) {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  div(scalar) {
    this.x /= scalar
    this.y /= scalar
    return this
  }

  mag() {
    return Vector2D.mag(this)
  }

  dot(vector) {
    return Vector2D.dot(this, vector)
  }

  dist(vector) {
    return Vector2D.dist(this, vector);
  }

  angle(vector) {
    return Math.acos(this.dot(vector) / (this.mag() * Vector2D.mag(vector)))
  }

  angle_in_degree(vector) {
    return UNIT_RADIAN_IN_DEGREE * this.angle(vector)
  }

  normalize() {
    return this.div(this.mag())
  }

  set_mag(scalar) {
    return this.normalize()
      .mult(scalar)
  }

  limit(scalar) {
    if(this.mag() > scalar)
      this.set_mag(scalar)
    return this
  }

  constraint(min, max) {
    if(this.mag() < min)
      this.set_mag(min)
    else if(this.mag() > max)
      this.set_mag(max)
    return this
  }

  rotate(radian) {
    const { x, y } = this
    this.x = x * Math.cos(radian) - y * Math.sin(radian)
    this.y = x * Math.sin(radian) + y * Math.cos(radian)
    return this
  }

  rotate_in_degree(degree) {
    return this.rotate(UNIT_DEGREE_IN_RADIAN * degree)
  }

  projection(vector) {
    vector = vector.copy()
      .set_mag(this.dot(vector) / vector.mag())
    this.set(vector.x, vector.y)
    return this
  }

  static add(vector1, vector2) {
    return new Vector2D(0, 0)
      .add(vector1)
      .add(vector2)
  }

  static sub(vector1, vector2) {
    return new Vector2D(0, 0)
      .add(vector1)
      .sub(vector2)
  }

  static mult(vector, scalar) {
    return new Vector2D(0, 0)
      .add(vector)
      .mult(scalar)
  }

  static div(vector, scalar) {
    return new Vector2D(0, 0)
      .add(vector)
      .mult(scalar)
  }

  static mag(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
  }

  static dot(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y
  }

  static dist(vector1, vector2) {
    return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));
  }

  static projection(vector1, vector2) {
    return vector2.copy()
      .set_mag(Vector2D.dot(vector1, vector2) / Vector2D.mag(vector2))
  }

  static random() {
    return new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1)
  }

}
