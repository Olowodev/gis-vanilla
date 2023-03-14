import * as THREE from 'three'
import mapboxgl from 'mapbox-gl'
import { CityJSONLoader, CityJSONWorkerParser } from 'cityjson-threejs-loader'
import data from './media/dbag.json'
import obj from './media/3dbag1.obj'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


mapboxgl.accessToken = 'pk.eyJ1Ijoib2xvd29hIiwiYSI6ImNsZjNyMndhcTBnNm8zcm50cmFkZzI1NXAifQ.sUHuNAw9DIe1ATZcaV_ETg'

const div = document.getElementById('map')
const map = new mapboxgl.Map({
    container: div,
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 18,
    center: [5.38764, 52.15616],
    pitch: 60,
    antialias: true
})

const modelOrigin = [5.38764, 52.15616]
const modelAltitude = 0
const modelRotate = [Math.PI / 2, 0, 0]

const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
)

const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
}


const customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) {
        this.camera = new THREE.Camera()
        this.scene = new THREE.Scene()

        const directionalLight = new THREE.DirectionalLight(0xffffff)
        directionalLight.position.set(0, -70, 100).normalize()
        this.scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff)
        directionalLight2.position.set(0, 70, 100).normalize()
        this.scene.add(directionalLight2)

        const parser = new CityJSONWorkerParser()
        const loader1 = new CityJSONLoader( parser )
        loader1.load(data)
        console.log(data)

        // const loader = new OBJLoader()
        // loader.load(obj, (object) => {
        //     this.scene.add(object),
        //     (xhr) => {
        //         console.log( (xhr.loaded / xhr.total * 100) + '% loaded')
        //     },
        //     (error) => {
        //         console.log(error)
        //     }
        // })

//         const loader = new GLTFLoader();
// loader.load(
// 'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
// (gltf) => {
// this.scene.add(gltf.scene);
// }
// );
// console.log('loaderScene', loader1.scene)
// console.log('test', loader1.scene.children)
//         const loader1Children = loader1.scene.children
//         console.log('children', loader1Children)
        // console.log('firstchild', loader1Children)
        // for (let i = 0; i < loader1Children.length; i++) {
        //     console.log('child', loader1Children[i])

        //     const type = loader1Children[i].geometry.attributes.type
        //     console.log('type', type)
        //     const surfacetype = loader1Children[i].geometry.attributes.surfacetype
        //     console.log('surfacetype', surfacetype)
        // }
//         loader1Children.forEach((child) => {
//             console.log(child)
//             // const surfacetype = child.geometry.attributes.surfacetype
//             // const type = child.geometry.attributes.type
//             // console.log('surface', surfacetype)
//             // console.log('type', type)
//         });

// console.log(loader1.scene.getObjectById(1))
        // this.scene.add(loader1.scene)

            // loader1.scene.traverse( child => {
            //     console.log('child', child)
            //     child.traverse( child2 => {
            //         console.log('child2', child2)
            //         const surfacetype = child2.geometry.attributes.surfacetype
            //         const type = child2.geometry.attributes.type
            //         console.log('surface', surfacetype)
            //         console.log('type', type)
            //     })
                
            // })
//         this.scene.traverse( c => {
//             if (c.geometry) {
//                 const attr = c.geometry.getAttribute("type")
//                 const attr2 = c.geometry.getAttribute("surfacetype")
//                 console.log('type', attr)
//                 console.log('surfacetype', attr2)
//             }
//         })

        this.map = map

        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        })

        this.renderer.autoClear = false
    },
    render: function (gl, matrix) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
        )
        const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
        )
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
        )


        const m = new THREE.Matrix4().fromArray(matrix)
        const l = new THREE.Matrix4()
            .makeTranslation(
                modelTransform.translateX,
                modelTransform.translateY,
                modelTransform.translateZ
            )
            .scale(
                new THREE.Vector3(
                    modelTransform.scale,
                    -modelTransform.scale,
                    modelTransform.scale
                )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ)


        this.camera.projectionMatrix = m.multiply(l)
        this.renderer.resetState()
        this.renderer.render(this.scene, this.camera)
        this.map.triggerRepaint()
    }
}

map.on('style.load', () => {
    map.addLayer(customLayer, 'waterway-label')
})