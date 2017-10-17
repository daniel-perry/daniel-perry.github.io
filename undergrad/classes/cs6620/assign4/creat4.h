Scene* make_scene()
{
  Scene* scene = new Scene();
  scene->setBackground(new ConstantBackground(Color(0.5, 0.8, 0.9)));
  Group* world = new Group();
  
  Material * phong_m = new PhongMaterial( Color(.9,.6,.3) , .6 , .4 , Color(1,1,1), 30 );
 
  Material * metal_m = new MetalMaterial( Color(.9,.9,.9) , 100 );
  
  Material* ball3_m = new LambertianMaterial( Color(.6, .5, .7), .6 , .4 );
  world->addObject( new Plane( ball3_m , Vector(0,0,1), Point(0,0,-2)) );

  Material* disk_m = new PhongMaterial( Color(.6, .9, .6), .6 , .4, Color(1,1,1),30 );
  world->addObject( new Disk( disk_m , Vector(0,0,1), Point(0,0,-1.8), 8) );


  Material* sphere_m = new PhongMaterial( Color(.9, .6, .6), .6 , .4,Color(1,1,1),30 );
  world->addObject( new Sphere( sphere_m , Point(.15,2.2,2), .4) );

  world->addObject( new Box( metal_m , Point(-3,-3,1), Point(3,3,1.1)) );
  
   
  Material* dielec_m = new DielectricMaterial(1.05, 100);

  //world -> addObject( new Box( dielec_m , Point(-1, 1.75 , 1) , Point(2,2,3) ) ); 

  world->addObject( new Sphere( phong_m , Point(1.5,1,2.75), .5) );


  world->addObject( new Sphere( dielec_m , Point(1.5,2.5,2.75), .5) );
  world->addObject( new Sphere( dielec_m , Point(.5,.5,2.75), .5) );


  world->addObject( new Sphere( metal_m , Point(3,2,6), 2.5) );
  


  

  /*
  Material* hfmatl = new PhongMaterial(Color(0.5, 0.6, .3), 0.6, 0.4, Color(1,1,1), 30);
  world->addObject(new Heightfield(metal_m,
                                   "sinc_200_200.hf",
                                   Point(1.5, 0.0, 0), Point(4.5, 3.0 , 0)));
  */
  scene->setObject(world);
  scene->setAmbient(Color(.4, .4, .4));

  scene->addLight(new PointLight(Point(0,4,2), Color(.9,.9,.9)));
  //scene->addLight(new PointLight(Point(0,-2,2), Color(.9,.9,.9)));
  scene->addLight(new PointLight(Point(0,-2,10), Color(.9,.9,.9)));

  scene->setCamera(new PinholeCamera(Point(-5,4.5,5), Point(3.5,2,2), Vector(0,0,1), 45 , 1));

  scene->setMaxRayDepth( 50 );
  scene->setMinAttenuation( .01 );

  return scene;
}
