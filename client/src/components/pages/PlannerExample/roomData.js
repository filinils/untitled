export default `{
	"floorplan": 
	{
		"corners":
			{
				"4e312eca-6c4f-30d1-3d9a-a19a9d1ee359":{"x":294.64,"y":232.664},
				"11d25193-4411-fbbf-78cb-ae7c0283164b":{"x":1044.7019999999998,"y":232.664},
				"6610a7df-1982-d92d-1463-7a4249857ac9":{"x":294.64,"y":-235.71200000000002},
				"8eff2a8a-0bbe-66c8-4181-8351ee13bd27":{"x":1044.7019999999998,"y":-235.71200000000002}
			},
		"walls":
		[
			{
				"corner1":"6610a7df-1982-d92d-1463-7a4249857ac9",
				"corner2":"4e312eca-6c4f-30d1-3d9a-a19a9d1ee359",
				"frontTexture":{"url":"assets/rooms/textures/wallmap.png","stretch":true,"scale":0},
				"backTexture":{"url":"assets/rooms/textures/wallmap_blue.png","stretch":true,"scale":null}
			},
			{
				"corner1":"11d25193-4411-fbbf-78cb-ae7c0283164b",
				"corner2":"8eff2a8a-0bbe-66c8-4181-8351ee13bd27",
				"frontTexture":{"url":"assets/rooms/textures/wallmap.png","stretch":true,"scale":0},
				"backTexture":{"url":"assets/rooms/textures/wallmap_blue.png","stretch":true,"scale":null}
			},
			{
				"corner1":"4e312eca-6c4f-30d1-3d9a-a19a9d1ee359",
				"corner2":"11d25193-4411-fbbf-78cb-ae7c0283164b",
				"frontTexture":{"url":"assets/rooms/textures/wallmap.png","stretch":true,"scale":0},
				"backTexture":{"url":"assets/rooms/textures/wallmap_blue.png","stretch":true,"scale":null}
			},
			{
				"corner1":"6610a7df-1982-d92d-1463-7a4249857ac9",
				"corner2":"8eff2a8a-0bbe-66c8-4181-8351ee13bd27",
				"frontTexture":{"url":"assets/rooms/textures/wallmap_blue.png","stretch":true,"scale":0},
				"backTexture":{"url":"assets/rooms/textures/wallmap.png","stretch":true,"scale":null}
			}
		],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},
	
	"items": [

	  {
		"item_name": "Bed",
		"item_type": 1,
		"model_url": "assets/models/IKEA/bed.fbx",
		"xpos": 900,
		"ypos": 500,
		"zpos": -15.988409993966997,
		"rotation": -1.5707963267948966,
		"scale_x": 1,
		"scale_y": 1,
		"scale_z": 1,
		"fixed": false,
		"options":{"ex":"hi"},
		"texture_maps":[
			{
			"type":"map",
			"url":"assets/models/IKEA/bed_baseColor_1024.jpg"
		},
			{
			"type":"normal",
			"url":"assets/models/IKEA/bed_normal_1024.jpg"
		},
			{
			"type":"metallic",
			"url":"assets/models/IKEA/bed_metallic_1024.jpg"
		},
			{
			"type":"roughness",
			"url":"assets/models/IKEA/bed_roughness_1024.jpg"
		}
	]},
		 
		{
			"item_name": "Window",
			"item_type": 3,
			"model_url": "assets/models/Window/Window_geo/Window_geo.fbx",
			"xpos": 886.8841174461031,
			"ypos": 139.1510114697785,
			"zpos": -105.16400146484375,
			"rotation": 0,
			"scale_x": 1,
			"scale_y": 1,
			"scale_z": 1,
			"fixed": false,
			"texture_maps":[
				{
				"type":"map",
				"url":"assets/models/Window/Window_textures/1024/Window_geo_window_frame_mat_BaseColor.jpg"
			},
				{
				"type":"normal",
				"url":"assets/models/Window/Window_textures/1024/Window_geo_window_frame_mat_Normal.jpg"
			},
				{
				"type":"metallic",
				"url":"assets/models/Window/Window_textures/1024/Window_geo_window_frame_mat_Metallic.jpg"
			},
				{
				"type":"roughness",
				"url":"assets/models/Window/Window_textures/1024/Window_geo_window_frame_mat_Roughness.jpg"
			}
		]
			},
	 
			{
					"item_name": "Floor Lamp",
						"item_type": 1,
						"model_url": "assets/models/js/ore-3legged-white_baked.js",
						"xpos": 346.697102333121,
						"ypos": 72.163997943445,
						"zpos": -175.19915302127583,
						"rotation": 0,
						"scale_x": 1,
						"scale_y": 1,
						"scale_z": 1,
						"fixed": false
					  },
	 
	  
	 
	  {
		"item_name": "Bookshelf",
		"item_type": 1,
		"model_url": "assets/models/Bookshelf/Bookshelf_geo/Bookshelf_geo.fbx",
		"xpos": 320,
		"ypos": 42.54509923821,
		"zpos": -21.686174295784554,
		"rotation": 1.5707963267948966,
		
		"scale_x": 1,
		"scale_y": 1,
		"scale_z": 1,
		"fixed": false,
		"texture_maps":[
			{
			"type":"map",
			"url":"assets/models/Bookshelf/Bookshelf_textures/1024/Bookshelf_geo_bookshelf_mat_BaseColor.jpg"
		},
			{
			"type":"normal",
			"url":"assets/models/Bookshelf/Bookshelf_textures/1024/Bookshelf_geo_bookshelf_mat_Normal.jpg"
		},
			{
			"type":"metallic",
			"url":"assets/models/Bookshelf/Bookshelf_textures/1024/Bookshelf_geo_bookshelf_mat_Metallic.jpg"
		},
			{
			"type":"roughness",
			"url":"assets/models/Bookshelf/Bookshelf_textures/1024/Bookshelf_geo_bookshelf_mat_Roughness.jpg"
		}
	]
	  }
	]
  }
  `;
