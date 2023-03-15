import { latLngToVector3, ThreeJSOverlayView } from "@googlemaps/three"
import { CityJSONLoader, CityJSONWorkerParser } from "cityjson-threejs-loader"
import data from './media/dbag.json'
import data2 from './media/dbag2.json'
import * as THREE from "three"
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import proj4 from "proj4"

function initMap() {
  

  

  function buildMap(selected) {
    console.log('building')
  // const bbox = {min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity]}
  // for (const vertex of data.vertices) {
  //   for (let i = 0; i < 3; i++) {
  //     bbox.min[i] = Math.min(bbox.min[i], vertex[i])
  //     bbox.max[i] = Math.max(bbox.max[i], vertex[i])
  //   }
  // }

  // const center = bbox.min.map((v, i) => (v + bbox.max[i]) / 2)

  const bbox = {min: [93020.80535217284, 441390.3222985839], max: [94328.40995117188, 442657.3331323242]}
  const bbox2 = {min: [231950.2690419922, 580268.0473933105], max: [233249.2989682922, 581562.3079829101]}
  const center = bbox.min.map((v, i) => (v + bbox.max[i]) / 2)
  const center2 = bbox2.min.map((v, i) => (v + bbox2.max[i]) / 2)

  // console.log(center)
  // console.log(center2)
  // const sourceCRS = `+proj=utm +zone=10 +ellps=GRS80 +units=m +no_defs`
  // const targetCRS = `+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees`
  const sourceCRS = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +units=m'
  const targetCRS = 'EPSG:4326'
  const transform = proj4(sourceCRS, targetCRS)
  const [longitude, latitude] = transform.forward(selected == 'first' ? center : center2)

  console.log(latitude, longitude)

const mapOptions = {
    center: {
      // lng: -122.34378755092621,
      // lng: 5.38764,
      // lat: 52.15616
      lng: longitude,
      lat: latitude
      // lat: 47.607465080615476
    },
    mapId: 'dc15dc155ec03ac6',
    zoom: 15,
    heading: 45,
    tilt: 67,
  }

  //creat scene
  const scene = new THREE.Scene()

  //initialize google map
  const map = new google.maps.Map(document.getElementById('map'), mapOptions)

  //create box mesh with geometry and material
  // const boxGeometry = new THREE.BoxGeometry(16, 16, 16)
  // const boxMaterial = new THREE.MeshNormalMaterial()
  // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
  // //position mesh to the center of the view
  // boxMesh.position.copy(latLngToVector3(mapOptions.center))
  // boxMesh.position.setY(45)
  // //add mesh to the scene
  // scene.add(boxMesh)


  //add lighting to the scene to allow the users see the meshes
  const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(0, -70, 100).normalize()
      scene.add(directionalLight)

      const directionalLight2 = new THREE.DirectionalLight(0xffffff)
      directionalLight2.position.set(0, 70, 100).normalize()
      scene.add(directionalLight2)

      const parser = new CityJSONWorkerParser()
        const loader1 = new CityJSONLoader( parser )
        loader1.load(selected == 'first' ? data : data2)
        console.log(data)

        loader1.scene.position.copy(latLngToVector3(mapOptions.center))
        // loader1.scene.rotateZ(90)
        loader1.scene.rotation.x = -1.6
        loader1.scene.position.x += 40
        loader1.scene.position.z -= 10
        window.loader1Scene = loader1.scene
        scene.add(loader1.scene)
        console.log(loader1.scene)

      //loader
  // const loader = new OBJLoader()
  //load original .obj file from the dataset (doesn't display anything)

//   loader.load('/3dbag1.obj',
//     (obj) => {
//       obj.position.copy(latLngToVector3(mapOptions.center))
//       obj.position.setY(45)
//       scene.add(obj)
//       console.log(obj)
//     }
//   )

  var objVar;

  //load a map marker exactly same way

//   loader.load('./media/pointer.obj',
//   (obj) => {
//     obj.scale.x = 0.1
//     obj.scale.y = 0.1
//     obj.scale.z = 0.1
//     obj.position.copy(latLngToVector3(mapOptions.center))
//     obj.position.setY(85)
//     scene.add(obj)
//     objVar = obj
//     // console.log(obj)
//   })


  //initialize google map's webGlOverlayView
  const overlay = new ThreeJSOverlayView({
    scene,
    map,
    THREE
  });

//   console.log(overlay.scene.children[0])

// const webGlOverlayView = new google.maps.webGlOverlayView()
// webGlOverlayView.setMap(map)



  //animate meshes
  const animate = () => {
    // boxMesh.rotation.x += 0.001
    // boxMesh.rotation.y += 0.001
    // if (objVar) {
    // objVar.rotation.y += 0.01
    // }
    // loader1.scene.rotation.x += 0.1
    // console.log(loader1.scene.rotation.x)
    // controls.update()
    // renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

let selected = 'first';
buildMap(selected)

  const option1 = document.getElementById('option1')
  const option2 = document.getElementById('option2')

  function changeBackgroundcolor() {
    console.log('changing color')
    if (selected == 'first') {
      option1.style.backgroundColor = '#9cc09f50'
      option2.style.backgroundColor = 'white'
    } else if (selected == 'second') {
      option1.style.backgroundColor = 'white'
      option2.style.backgroundColor = '#9cc09f50'
    }
  }

  changeBackgroundcolor()

  option1.addEventListener('click', ()=> {
    console.log('option1 clicked')
    selected = 'first'
    changeBackgroundcolor()
    buildMap(selected)
  })
  // option1.onclick(()=> {
    
  // })

  option2.addEventListener('click', () => {
    console.log('option2 clicked')
    selected = 'second'
    changeBackgroundcolor()
    buildMap(selected)
  })
  // option2.onclick(()=> {
    
  // })

}


initMap()