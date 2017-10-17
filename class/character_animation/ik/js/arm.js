/* Copyright (c) 2014 Daniel Perry
 * depends on Three.js and Underscore.js
 */

/** Arm - encapsulates the arm stuff in Three.js
 */
function Arm (origin, lengths, colors, jointtypes, constraints, render) {
	this.joints = [];
	this.segments = [];
	this.hack_segments = []; // for handling different scales
	this.lengths = lengths;
	this.joint_types = jointtypes;
	this.constraints = constraints;
	this.colors = colors;
	this.renderCB = render;

	var joint_material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdd0000, specular: 0x999900, shininess: 30, shading: THREE.FlatShading } );
	var joint_geometry = new THREE.SphereGeometry( 1, 100, 100 );

	var joints = this.joints;
	var segments = this.segments;
	var hack_segments = this.hack_segments;
	var joint_types = this.joint_types;

	_.each( _.zip(lengths, colors, jointtypes),
			function(seg){

				// joint
				var joint = new THREE.Mesh(joint_geometry, joint_material);
				if(segments.length == 0){
					joint.position.x = origin.x;
					joint.position.y = origin.y;
					joint.position.z = origin.z;
				}else{
					var last_segment = segments[segments.length-1];
					//joint.position.x = lengths[segments.length-1]/2.0; 
					joint.position.x = .01/2; 
					joint.position.y = 0;
					joint.position.z = 0;
					hack_segments[segments.length-1].add(joint); // add as child of previous segment.
				}

				joints.push(joint);

				// segment
				var seg_length = seg[0];
				var seg_color = seg[1];
				var segment_geometry = new THREE.BoxGeometry(seg_length,1,1);
				var segment_material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: seg_color, specular: 0x999900, shininess: 30, shading: THREE.FlatShading } );
				var segment = new THREE.Mesh(segment_geometry, segment_material);

				segment.position.x = seg_length/2.0;
				segment.position.y = 0;
				segment.position.z = 0;

				joint.add(segment); // add as child to joint.

				segments.push(segment);

				// hack to make rescaling child geometry easier...
				var hack_segment_geometry = new THREE.BoxGeometry(.01,.01,.01);
				var hack_segment_material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: seg_color, specular: 0x999900, shininess: 30, shading: THREE.FlatShading } );
				var hack_segment = new THREE.Mesh(hack_segment_geometry, hack_segment_material);
				hack_segment.position.x = lengths[segments.length-1]/2.0; 
				hack_segment.position.y = 0;
				hack_segment.position.z = 0;

				segment.add(hack_segment); // add as child to segment
				hack_segments.push(hack_segment);

				//joint_types.push(seg[2]); // save joint type
			});

	// end effector position:
	var ee_material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdd0000, specular: 0x999900, shininess: 30, shading: THREE.FlatShading } );
	var ee_geometry = new THREE.SphereGeometry( .01, 100, 100 );
	this.end_effector = new THREE.Mesh(ee_geometry, ee_material);
	this.end_effector.position.x = lengths[lengths.length-1]/2.0;
	hack_segments[hack_segments.length-1].add(this.end_effector);

	this.shoulder = joints[0];
	if(joints.length >= 1){
		this.elbow = joints[1];
	}
	if(joints.length >= 2){
		this.wrist = joints[2];
	}

	this.base = this.shoulder; // set the base object
}

Arm.prototype.addToScene = function(scene){
	scene.add(this.base);
}

Arm.prototype.removeFromScene = function(scene){
	scene.remove(this.base);
}

// @param quats - list of quaternions to apply to rotational joints
Arm.prototype.forward = function( quats, dists, alpha ){
	var i;
	var j;
	var quats_i = 0;
	var dists_i = 0;
	for(i=0; i<this.joints.length; ++i){
		if(this.joint_types[i] == "hinge" || this.joint_types[i] == "ball"){
			var q = quats[quats_i++];
			this.joints[i].quaternion.slerp(q,alpha);
		}else if(this.joint_types[i] == "prismatic"){
			var joint = this.joints[i];
			var seg = this.segments[i];
			var hack_seg = this.hack_segments[i];
			
			var dist = dists[dists_i++];
			var length = this.lengths[i];
			var goal_scale = dist/length;
			var diff = alpha*(goal_scale - seg.scale.x);
			var old_scale = seg.scale.x;
			seg.scale.x = seg.scale.x + diff;

			var hack_old_scale = hack_seg.scale.x;
			hack_seg.scale.x = 1.0/seg.scale.x; // invert scale for the rest of the appendage.

			var pos_diff = (seg.scale.x * length - old_scale * length)/2;
			var dir = new THREE.Vector3(
					seg.position.x - joint.position.x,
					seg.position.y - joint.position.y,
					seg.position.z - joint.position.z );
			dir.normalize();
			dir.x *= pos_diff;
			dir.y *= pos_diff;
			dir.z *= pos_diff;

			seg.position.x += dir.x
			seg.position.y += dir.y
			seg.position.z += dir.z

			var hack_pos_diff = (hack_seg.scale.x * .01 - hack_old_scale * .01)/2;
			dir.normalize();
			dir.x *= hack_pos_diff;
			dir.y *= hack_pos_diff;
			dir.z *= hack_pos_diff;

			hack_seg.position.x += dir.x
			hack_seg.position.y += dir.y
			hack_seg.position.z += dir.z

			hack_seg.position.x = (this.lengths[i] * seg.scale.x)/2.0;
			joint.position.x = (.01 * hack_seg.scale.x)/2.0;
		}	
	}
}

var animate_arm = function(quats,dists,arm,alpha,step_size){
	arm.forward(quats,dists,alpha);
	arm.renderCB();
	var step = 0.1;
	if((alpha+step) >= 1.0){
		return;
	}
	//var step_size = 0.01;
	var duration_millis = 3000;
	var millis = step_size * duration_millis;
	setTimeout(function(){ animate_arm(quats,dists,arm,alpha+step, step_size); }
									    , millis);
};

Arm.prototype.randomPosition = function(){
	var quats = [];
	var dists = [];
	var i;
	for(i=0; i<this.joints.length; ++i){
		if(this.joint_types[i] == "hinge"){
			var joint = this.joints[i];
			var seg = this.segments[i];

			var a = this.constraints[i][0] + Math.random()*(this.constraints[i][1]-this.constraints[i][0]); 
			var v = new THREE.Vector3(0,0,1);
			v.applyQuaternion(joint.quaternion);
			
			q = new THREE.Quaternion();
			q.setFromAxisAngle(v,a);
			quats.push(q);
		}else if(this.joint_types[i] == "prismatic"){
			var new_dist = this.constraints[i][0] + Math.random()*(this.constraints[i][1]-this.constraints[i][0]); 
			if(new_dist < 0.5){
				new_dist = 0.5;
			}
			dists.push(new_dist);
		}else if(this.joint_types[i] == "ball"){
			var v = new THREE.Vector3(Math.random(), Math.random(), Math.random());
			v.normalize();
			var a = this.constraints[i][0] + Math.random()*(this.constraints[i][1]-this.constraints[i][0]); 

			q = new THREE.Quaternion();
			q.setFromAxisAngle(v,a);
			quats.push(q);
		}
	}
	// apply transform:
	var step_size = 0.01;
	animate_arm(quats,dists,this,step_size, 0.01);
}
