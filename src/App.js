import * as THREE from 'three'
import mapboxgl from 'mapbox-gl'
// import { GeoPackageManager } from '@ngageoint/geopackage'
import { CityJSONLoader, CityJSONWorkerParser } from 'cityjson-threejs-loader'
// import cityjsonData from './3dbag1.json'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import data from './media/dbag.json'
import { AmbientLight, DirectionalLight, sRGBEncoding, Vector3 } from 'three'
import axios from 'axios'

mapboxgl.accessToken = "pk.eyJ1Ijoib2xvd29hIiwiYSI6ImNsZjNyMndhcTBnNm8zcm50cmFkZzI1NXAifQ.sUHuNAw9DIe1ATZcaV_ETg"

const init =async () => {
  const div = document.getElementById('map')
const map = new mapboxgl.Map({
    container: div,
  style: "mapbox://styles/mapbox/streets-v11",
  center: [5.38764, 52.15616],
  zoom: 18
})
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0001, 4000)
  // camera.position.z = 5
  camera.position.set(1,100,200)
  camera.up.set(0,0,1)

  const ambientLight = new AmbientLight( 0x666666, 0.7)
  scene.add(ambientLight)

  const dirLight = new DirectionalLight( 0xffffff, 1)
  dirLight.position.set(1,2,3)
  scene.add(dirLight)

  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshNormalMaterial()
  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  


const parser = new CityJSONWorkerParser()
const loader = new CityJSONLoader( parser )


// try {
//   const url = new URL('http://localhost:1234/src/media/test.jpg')
//   const res = await axios.get( url )
//   console.log(res)
//   const json = await res.data
//   console.log(json)
//   loader.load( json )

//   scene.add(loader.scene)
// } catch(err) {
//   console.log(err)
// }

		// .then( res => {

		// 	if ( res.ok ) {
    //     console.log(res)
    //     console.log(res.body)
		// 		console.log(res.json())
		// 		return res.json();

		// 	}

		// } )
		// .then( data => {

		// 	const citymodel = data;
		// 	loader.load( data );

		// 	const bbox = loader.boundingBox.clone();
		// 	bbox.applyMatrix4( loader.matrix );


		// 	scene.add(loader.scene)
		// 	// modelgroup.add( loader.scene );

		// } );
    
  



const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setPixelRatio(window.devicePixelRatio)
// renderer.setAnimationLoop(animation)
// renderer.setClearColor(0xffffff, 0)
// renderer.domElement.style.position = 'absolute'
// renderer.domElement.style.top = 0
// renderer.domElement.style.zIndex = 1
renderer.outputEncoding = sRGBEncoding
document.body.appendChild(renderer.domElement)
// map.getCanvasContainer().appendChild(renderer.domElement)
const controls = new OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = false;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;


  console.log(data)
    loader.load(data)

    // const [minX, minY, minZ, maxX, maxY, maxZ] = data.metadata.geographicalExtent
    // const bounds = [[minX, minY], [maxX, maxY]]
    // map.fitBounds(bounds, {padding: 20})

    const bbox = loader.boundingBox.clone()
    bbox.applyMatrix4( loader.matrix )


    // fitCameraToSelection( camera, controls, bbox )

    scene.add(loader.scene)

    

    console.log(scene)
function fitCameraToSelection( camera, controls, box, fitOffset = 1.2 ) {

  // From https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/24

  // const box.makeEmpty();
  // for ( const object of selection ) {

  //   box.expandByObject( object );

  // }
  const size = new Vector3();
  const center = new Vector3();

  box.getSize( size );
  box.getCenter( center );

  const maxSize = Math.max( size.x, size.y, size.z );
  const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );

  const direction = controls.target.clone()
    .sub( camera.position )
    .normalize()
    .multiplyScalar( distance );

  controls.maxDistance = distance * 10;
  controls.target.copy( center );

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  camera.position.copy( controls.target ).sub( direction );

  controls.update();

}

function resize() {
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  camera.aspect = width / height

  camera.updateProjectionMatrix()
}

resize()

window.addEventListener('resize', resize)

// function animation(time) {
//   controls.update()
//   renderer.render(scene, camera)
// }

map.on('load', () => {
  map.addLayer({
    id: 'customLayer',
    type: 'custom',
    renderingMode: '3d',
    onAdd: (map, mbxContext) => {
      renderer.setClearColor(mbxContext.getClearColor())
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(map.getCanvas().width, map.getCanvas().height)

      const canvas = renderer.domElement
      canvas.style.position = 'absolute'
      canvas.style.top = 0
      canvas.style.left = 0

      mbxContext.container.appendChild(canvas)
    },
    render: (gl, matrix) => {
      renderer.state.reset()
      renderer.render(scene, camera)
    }
  })
})



}

init()


// const fetchData = async () => {
//     const url = "./3dbag1.gpkg";
//     const response = await fetch(url);
//     const buffer = await response.arrayBuffer();
//     const db = await GeoPackageManager.open(buffer);
//     console.log(db)
//     const tables = await db.getFeatureTables();
//     const features = [];
//     for (const table of tables) {
//       const dao = await db.getFeatureDao(table);
//       const rows = await dao.queryForEach();
//       for (const row of rows) {
//         const geometry = row.getGeometry();
//         const properties = row.getProperties();
//         features.push({
//           type: "Feature",
//           geometry: geometry.toGeoJSON(),
//           properties
//         });
//       }
//     }
//     const source = {
//       type: "geojson",
//       data: {
//         type: "FeatureCollection",
//         features
//       }
//     };
//     map.addSource("buildings", source);
//     map.addLayer({
//       id: "buildings",
//       type: "fill-extrusion",
//       source: "buildings",
//       paint: {
//         "fill-extrusion-color": "#aaa",
//         "fill-extrusion-height": ["get", "height"],
//         "fill-extrusion-base": 0,
//         "fill-extrusion-opacity": 0.8
//       }
//     });
//   };
  
//   fetchData();