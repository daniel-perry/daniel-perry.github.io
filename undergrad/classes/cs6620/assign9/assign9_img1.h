Scene* make_scene()
{
  Scene* scene = new Scene();
  
  scene->imageX = 512;
  scene->imageY = 512;
  
  //scene->imageX = 1;
  //scene->imageY = 1;


  //scene->imageX = 16;
  //scene->imageY = 16;

  scene->setBackground(new ConstantBackground(Color(0.5, 0.8, 0.9)));
  Group* world = new Group();
  
  
  Material* ball_m = new PhongMaterial( Color(.9, .6, .3), 1 , 0 , Color(1,1,1), 30);
  /*
  world->addObject( new Triangle( ball_m , Point(5.5,1,0), Point(5.5, 0, 0 ), Point(5.5,0,1)) );
  world->addObject( new Triangle( ball_m , Point(5.5,1,0), Point(5.5, 1, 1 ), Point(5.5,0,1)) );

  
  Material* balll_m = new PhongMaterial( Color(.2, .8, .3), 1 , 0 , Color(1,1,1), 30);
  world->addObject( new Triangle( balll_m , Point(3,1,0), Point(3, 0, 0 ), Point(3,0,1)) );
  
  */


  Primitive * ball1 = new Box( ball_m , Point(-1,-1,-1), Point(1,1,1) );
  //Primitive * ball1 = new Sphere( ball_m , Point(-1,-1,-1), 1 );

  world->addObject( ball1 );


   Material* ball2_m = new PhongMaterial( Color(.6, .9, .3), 1 , 0 , Color(1,1,1), 30);
  matrix t_matrix = makeTransMatrix( 1.5 , -2.5 , 2 )*makeScaleMatrix( .5,.5,.5)*makeRotateYMatrix(M_PI/6);
  Primitive * inst1 = new TInstance( ball1 , ball2_m , t_matrix );
  world->addObject( inst1 );

  Material* ball3_m = new PhongMaterial( Color(.6, .3, .9), 1 , 0 , Color(1,1,1), 30);
  matrix t_matrix2 = makeTransMatrix( -1.5 , 2.5 , -2 )*makeRotateYMatrix(M_PI/6)*makeScaleMatrix( .25,.25,1.25);
  world->addObject( new TInstance( ball1 , ball3_m , t_matrix2 ) );


  Material* ball4_m = new PhongMaterial( Color(.3, .6, .7), 1 , 0 , Color(1,1,1), 30);
  matrix t_matrix3 = makeTransMatrix( 1.5 , -1.5 , -2 )*makeShearYMatrix(.2,.9)*makeScaleMatrix( .25,.25,.5);
  world->addObject( new TInstance( ball1 , ball4_m , t_matrix3 ) );

  /*
  Material* ball2_m = new PhongMaterial( Color(.9, .6, .3), 1 , 0 , Color(1,1,1), 30);
  world->addObject( new Sphere( ball2_m , Point(5.5,0,0), .25) );
  world->addObject( new Sphere( ball2_m , Point(5.5,.5,1), .25) );
  world->addObject( new Sphere( ball2_m , Point(5.5,1,1), .25) );
  world->addObject( new Sphere( ball2_m , Point(5.5,1.5,1), .25) );
  */
  //Material* ball3_m = new LambertianMaterial( Color(.6, .5, .7), .6 , .4 );
  //world->addObject( new Disk( ball3_m , Vector(0,0,1), Point(0,0,-2) , 10));
  
  //Material * coup_m = new CoupledMaterial( Color(.9,.6,.3), 1 , 0 , Color(1,1,1) , 30 );
  //world->addObject( new Sphere( coup_m , Point(5.5,0,0), .5) );
  
  //Material * phong_m = new PhongMaterial( Color(.5,.6,.3) , .6 , .4 , Color(1,1,1), 30 );

  //world -> addObject( new Box( dielec_m , Point(3, 0 , 0) , Point(4,1,1) ) ); 
  

  /*
  Material* hfmatl = new PhongMaterial(Color(0.5, 0.6, .3), 0.6, 0.4, Color(1,1,1), 30);
  world->addObject(new Heightfield(hfmatl,
                                   "sinc_200_200.hf",
                                   Point(-4.5, 2.0, 2), Point(-1.5, 5.0 , 4)));
  */    
  scene->setObject(world);
  scene->setAmbient(Color(.4, .4, .4));

  scene->addLight(new PointLight(Point(0,10,10), Color(.9,.9,.9)));
  scene->addLight(new PointLight(Point(20,0,10), Color(.5,.5,.5)));

  scene->setCamera(new PinholeCamera(Point(5,5,0), Point(0,0,0), Vector(0,0,1), 55 , 1));

  scene->setMaxRayDepth( 10 );
  scene->setMinAttenuation( .01 );


  //scene->setSampler( new UniformSample( 1 , scene));
  scene->setSampler( new JitteredSample( 9 , scene));
  scene->setFilter( new BoxFilter() );
  //scene->setFilter( new TentFilter() );
  //scene->setFilter( new GaussianFilter(.2) );
  //scene->setFilter( new LanczosSincFilter() );

  return scene;
}
