/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

const expect = require('expect');
const {
    wfsURL,
    wfsFilter,
    resultsSelector,
    featureCollectionResultSelector,
    paginationInfo,
    featureLoadingSelector,
    isDescribeLoaded,
    describeSelector,
    getFeatureById,
    attributesSelector
} = require('../query');

const idFt1 = "idFt1";
const idFt2 = "idFt2";
const modeEdit = "edit";
let feature1 = {
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [1, 2]
    },
    id: idFt1,
    properties: {
        someProp: "someValue"
    }
};
let feature2 = {
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [1, 2]
    },
    id: idFt2,
    properties: {
        someProp: "someValue"
    }
};

const initialState = {
    query: {
    featureTypes: {
      'editing:polygons': {
        geometry: [
          {
            label: 'geometry',
            attribute: 'geometry',
            type: 'geometry',
            valueId: 'id',
            valueLabel: 'name',
            values: []
          }
        ],
        original: {
          elementFormDefault: 'qualified',
          targetNamespace: 'http://geoserver.org/editing',
          targetPrefix: 'editing',
          featureTypes: [
            {
              typeName: 'poligoni',
              properties: [
                {
                  name: 'name',
                  maxOccurs: 1,
                  minOccurs: 0,
                  nillable: true,
                  type: 'xsd:string',
                  localType: 'string'
                },
                {
                  name: 'geometry',
                  maxOccurs: 1,
                  minOccurs: 0,
                  nillable: true,
                  type: 'gml:Polygon',
                  localType: 'Polygon'
                }
              ]
            }
          ]
        },
        attributes: [
          {
            label: 'name',
            attribute: 'name',
            type: 'string',
            valueId: 'id',
            valueLabel: 'name',
            values: []
          }
        ]
      }
    },
    data: {},
    result: {
      type: 'FeatureCollection',
      totalFeatures: 4,
      features: [
        {
          type: 'Feature',
          id: 'poligoni.1',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -39,
                  39
                ],
                [
                  -39,
                  38
                ],
                [
                  -40,
                  38
                ],
                [
                  -39,
                  39
                ]
              ]
            ]
          },
          geometry_name: 'geometry',
          properties: {
            name: 'test'
          }
        },
        {
          type: 'Feature',
          id: 'poligoni.2',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -48.77929687,
                  37.54457732
                ],
                [
                  -49.43847656,
                  36.06686213
                ],
                [
                  -46.31835937,
                  35.53222623
                ],
                [
                  -44.47265625,
                  37.40507375
                ],
                [
                  -48.77929687,
                  37.54457732
                ]
              ]
            ]
          },
          geometry_name: 'geometry',
          properties: {
            name: 'poly2'
          }
        },
        {
          type: 'Feature',
          id: 'poligoni.6',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -50.16357422,
                  28.90239723
                ],
                [
                  -49.69116211,
                  28.24632797
                ],
                [
                  -48.2409668,
                  28.56522549
                ],
                [
                  -50.16357422,
                  28.90239723
                ]
              ]
            ]
          },
          geometry_name: 'geometry',
          properties: {
            name: 'ads'
          }
        },
        {
          type: 'Feature',
          id: 'poligoni.7',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -64.46777344,
                  33.90689555
                ],
                [
                  -66.22558594,
                  31.95216224
                ],
                [
                  -63.32519531,
                  30.97760909
                ],
                [
                  -64.46777344,
                  33.90689555
                ]
              ]
            ]
          },
          geometry_name: 'geometry',
          properties: {
            name: 'vvvv'
          }
        }
      ],
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::4326'
        }
      }
    },
    resultError: null,
    open: true,
    isNew: false,
    filterObj: {
      featureTypeName: 'editing:polygons',
      groupFields: [
        {
          id: 1,
          logic: 'OR',
          index: 0
        }
      ],
      filterFields: [],
      spatialField: {
        method: null,
        attribute: 'geometry',
        operation: 'INTERSECTS',
        geometry: null
      },
      pagination: {
        startIndex: 0,
        maxFeatures: 20
      },
      filterType: 'OGC',
      ogcVersion: '1.1.0',
      sortOptions: null,
      hits: false
    },
    searchUrl: 'http://localhost:8081/geoserver/wfs?',
    typeName: 'editing:polygons',
    url: 'http://localhost:8081/geoserver/wfs?',
    featureLoading: false
  },
    featuregrid: {
        mode: modeEdit,
        select: [feature1, feature2],
        changes: [feature2]
    },
    highlight: {
        featuresPath: "featuregrid.select"
    }
};

describe('Test query selectors', () => {
    it('test wfsURL selector', () => {
        const searchUrl = wfsURL(initialState);
        expect(searchUrl).toExist();
        expect(searchUrl).toBe("http://localhost:8081/geoserver/wfs?");
    });
    it('test wfsFilter selector', () => {
        const filterObj = wfsFilter(initialState);
        expect(filterObj).toExist();
        expect(filterObj.featureTypeName).toBe("editing:polygons");
    });
    it('test resultsSelector selector', () => {
        const res = resultsSelector(initialState);
        expect(res).toExist();
        expect(res.length).toBe(4);
    });
    it('test paginationInfo.startIndex selector', () => {
        const startIndex = paginationInfo.startIndex(initialState);
        expect(startIndex).toBe(0);
    });
    it('test paginationInfo.maxFeatures selector', () => {
        const maxFeatures = paginationInfo.maxFeatures(initialState);
        expect(maxFeatures).toBe(20);
    });
    it('test paginationInfo.resultSize selector', () => {
        const featuresLength = paginationInfo.resultSize(initialState);
        expect(featuresLength).toBe(4);
    });
    it('test paginationInfo.totalFeatures selector', () => {
        const totalFeatures = paginationInfo.totalFeatures(initialState);
        expect(totalFeatures).toBe(4);
    });
    it('test featureLoadingSelector selector', () => {
        const ftloading = featureLoadingSelector(initialState);
        expect(ftloading).toBe(false);
    });
    it('test describeSelector selector', () => {
        const describe = describeSelector(initialState);
        expect(describe.elementFormDefault).toBe("qualified");
    });
    it('test isDescribeLoaded', () => {
        const isLoaded = isDescribeLoaded(initialState, "editing:polygons");
        expect(isLoaded).toBe(true);
    });
    it('test getFeatureById selector', () => {
        const ft = getFeatureById(initialState, "poligoni.7");
        expect(ft).toExist();
        expect(ft.id).toBe("poligoni.7");
    });
    it('test attributesSelector selector', () => {
        const attr = attributesSelector(initialState);
        expect(attr).toExist();
        expect(attr.length).toBe(1);
        expect(attr[0].label).toBe("name");
        expect(attr[0].valueId).toBe("id");
    });
    it('test featureCollectionResultSelector selector', () => {
        const fc = featureCollectionResultSelector(initialState);
        expect(fc).toExist();
        expect(fc.features.length).toBe(4);
    });


});
