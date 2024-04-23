sploof = undef; // exists to be overridden from cli command

module example_scad () {
  a = [1, 2, ["a", true, false, 0, undef]];
  echo("__RECORD", "AAA", a);
  echo("__RECORD", "a.b.c.d", 23);
  echo("__RECORD", "sploof", sploof);
  cube(size = 1);
}
example_scad();