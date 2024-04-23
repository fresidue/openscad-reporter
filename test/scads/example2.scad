

module example2_scad () {
  echo("REC", "abcd", "efgh");
  echo("REC", "a.b.c.d", 23);
  cube(size = 1);
}
example2_scad();