import livDueGerarchia from '../DATA/liv_due_gerarchia.json';

let DATA_NORMALIZZATA = livDueGerarchia.data;

function compareArrayOfString(a, b) {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
}
// tabKey may be "liv0","liv1","liv2"
function getParentsOfVaules(dataNormalizzata, tabKey, values) {
    const table = dataNormalizzata[tabKey];
    if (!table) {
        throw "errore tabella non esiste: " + tabKey;
    }

    const selectedFromTable = values.map(value => {
        let {dentro} = table[value];
        return {tableKey: tabKey, value, dentro};
    });

    function riduciFun(acc, v) {
        let key = v.dentro;
        let presente = acc[key];

        if (presente) {
            presente.push(v);
            acc[key] = presente;
        } else {
            acc[key] = [v];
        }
        return acc;
    }
    const riassunto = selectedFromTable.reduce(riduciFun, {});

    function selezionaCampi(obj, soloId = true) {
        let newObj = {};
        Object
            .keys(obj)
            .map(key => {
                let lista = obj[key];
                let soloCampiSelezionati = lista.map(v => {
                    let {tableKey, value} = v;
                    if (soloId) {
                        return [tableKey, value]; // Id
                    }
                    return {tableKey, value};    // object
                });

                newObj[key] = soloCampiSelezionati;
            });

        return newObj;
    }

    let soloId = true;
    return selezionaCampi(riassunto, soloId);
}

// START-DOC----------------selezionaLegendaDaCartografati
// example: listaCartografati = ["A1.2", "A1.3", "A2.3", "B2.1", "C1.2", "C1.3", "C1.4", "C1.8"]
// vedi -> livDueGerarchia from '../DATA/liv_due_gerarchia.json';
// let DATA_NORMALIZZATA = livDueGerarchia.data;
function selezionaLegendaDaCartografati(dataNormalizzata, listaCartografati) {
    let liv2 = getParentsOfVaules(dataNormalizzata, "liv2", listaCartografati);
    let liv1 = getParentsOfVaules(dataNormalizzata, "liv1", Object.keys(liv2));
    let liv0 = getParentsOfVaules(dataNormalizzata, "liv0", Object.keys(liv1));

    return {liv0, liv1, liv2};
}

/* esempio_output_selezionaLegendaDaCartografati
{
    "liv0": {
        "root": [
            ["liv0", "A"], // example ident -> getFromDataNorm(data, ident) data = dataNormalizzata
            ["liv0", "B"],
            ["liv0", "C"]
        ]
    },
    "liv1": {
        "A": [
            ["liv1", "A1"],
            ["liv1", "A2"]
        ],
        "B": [
            ["liv1", "B2"]
        ],
        "C": [
            ["liv1", "C1"]
        ]
    },
    "liv2": {
        "A1": [
            ["liv2", "A1.2"],
            ["liv2", "A1.3"]
        ],
        "A2": [
            ["liv2", "A2.3"]
        ],
        "B2": [
            ["liv2", "B2.1"]
        ],
        "C1": [
            ["liv2", "C1.2"],
            ["liv2", "C1.3"],
            ["liv2", "C1.4"],
            ["liv2", "C1.8"]
        ]
    }
};
// END DOC--------------------- selezionaLegendaDaCartografati---------------------------------------*/

function getFromDataNorm(data, ident) {
    let [tabella, key] = ident;
    let valore = data[tabella] && data[tabella][key];
    return valore;
}

function createFlatten(dataNorm, legenda) {
    let root = [];
    let iDsLiv0 = legenda.liv0.root;
    iDsLiv0.forEach(ident => {
        let [tag0, id0] = ident;
        let value0 = getFromDataNorm(dataNorm, ident);
        root.push({tag: tag0, value: value0});
        let iDsLiv1 = legenda.liv1[id0];
        iDsLiv1.forEach(ident1 => {
            let [tag1, id1] = ident1;
            let value1 = getFromDataNorm(dataNorm, ident1);
            root.push({tag: tag1, value: value1});
            let iDsLiv2 = legenda.liv2[id1]; // value = A1, A2, B1 Fkey liv2 - iDs liv1
            iDsLiv2.forEach(ident2 => {      // value = A1.1, A1.2 - iDs liv2
                let tag2 = ident2[0];
                let value2 = getFromDataNorm(dataNorm, ident2);
                root.push({tag: tag2, value: value2});
            });
        });
    });

    return root;
}

// START-DOC---------------- example_createFlatten_root_output
/*
[
    {
        "tag": "liv0",
        "value":
        {
            "id": "A",
            "desc": "Rocce magmatiche",
            "dentro": "root"
        }
    },
    {
        "tag": "liv1",
        "value":
        {
            "id": "A1",
            "desc": "Rocce magmatiche intrusive",
            "dentro": "A"
        }
    },
    {
        "tag": "liv2",
        "value":
        {
            "rgb": "#E876B9",
            "id": "A1.3",
            "desc": "Granodioriti, Granodioriti tonalitiche, Microgranodioriti, Granodioriti monzogranitiche",
            "dentro": "A1"
        }
    },
    {
        "tag": "liv1",
        "value":
        {
            "id": "A2",
            "desc": "Rocce magmatiche effusive",
            "dentro": "A"
        }
    },
    {
        "tag": "liv2",
        "value":
        {
            "rgb": "#AB773F",
            "id": "A2.3",
            "desc": "Basalti alcalini, Trachibasalti, Hawaiiti, Mugeariti, Fonoliti, Fonoliti tefritiche",
            "dentro": "A2"
        }
    },
    {
        "tag": "liv0",
        "value":
        {
            "id": "C",
            "desc": "Rocce sedimentarie",
            "dentro": "root"
        }
    },
    {
        "tag": "liv1",
        "value":
        {
            "id": "C1",
            "desc": "Rocce sedimentarie terrigene",
            "dentro": "C"
        }
    },
    {
        "tag": "liv2",
        "value":
        {
            "rgb": "#DDF2EA",
            "id": "C1.2",
            "desc": "Depositi terrigeni continentali di conoide e piana alluvionale (ghiaie, sabbie, limi, argille), (conglomerati, arenarie, siltiti, peliti) ",
            "dentro": "C1"
        }
    },
    {
        "tag": "liv2",
        "value":
        {
            "rgb": "#FFFFCF",
            "id": "C1.3",
            "desc": "Depositi terrigeni continentali legati a gravità (detriti di versante, frane, coltri eluvio-colluviali, \"debris avalanches\", brecce)",
            "dentro": "C1"
        }
    },
    {
        "tag": "liv2",
        "value":
        {
            "rgb": "#E6F5A4",
            "id": "C1.4",
            "desc": "Depositi terrigeni palustri, lacustri, lagunari (limi, argille limose, fanghi torbosi con materia organica anche con intercalazioni di sabbie, selci)",
            "dentro": "C1"
        }
    },
    {
        "tag": "liv2",
        "value":
        {
            "rgb": "#FFED00",
            "id": "C1.8",
            "desc": "Depositi terrigeni fluvio-deltizi (sabbie, microconglomerati, arenarie carbonatiche, siltiti argillose)",
            "dentro": "C1"
        }
    }
]
// END DOC ------------------ example_createFlatten_root_output-----*/


// not used so far
function createTree(dataNorm, legenda) {
    let root = [];
    let iDsLiv0 = legenda.liv0.root;
    iDsLiv0.forEach(ident0 => {
        let value0 = getFromDataNorm(dataNorm, ident0);

        let new0 = {tag: "liv0", value: value0, children: []};

        let id0 = ident0[1];
        let iDsLiv1 = legenda.liv1[id0];
        iDsLiv1.forEach(ident1 => {
            let value1 = getFromDataNorm(dataNorm, ident1);

            let new1 = {tag: "liv1", value: value1, children: []};
            new0.children.push(new1);

            let id1 = ident1[1];
            let iDsLiv2 = legenda.liv2[id1]; // value = A1, A2, B1 Fkey liv2 - iDs liv1
            iDsLiv2.forEach(ident2 => { // value = A1.1, A1.2 - iDs liv2
                let value2 = getFromDataNorm(dataNorm, ident2);

                let new2 = {tag: "liv2", value: value2}; // no children is a Leaf
                new1.children.push(new2);
            });
        });
        root.push(new0);
    });
    return root;
}

// not used so far
export function getTreeGerarchia(codiciTrovati) {
    if (codiciTrovati.length === 0) {
        return [];
    }
    codiciTrovati.sort(compareArrayOfString);
    let legCartografato = selezionaLegendaDaCartografati(DATA_NORMALIZZATA, codiciTrovati);
    return createTree(DATA_NORMALIZZATA, legCartografato);
}

// example: codiciTrovati = ["A1.2", "A1.3", "A2.3", "B2.1", "C1.2", "C1.3", "C1.4", "C1.8"]
export function getFlattenGerarchia(codiciTrovati) {
    if (codiciTrovati.length === 0) {
        return [];
    }
    codiciTrovati.sort(compareArrayOfString);
    let legCartografato = selezionaLegendaDaCartografati(DATA_NORMALIZZATA, codiciTrovati);
    return createFlatten(DATA_NORMALIZZATA, legCartografato);
}

function creaLegendaTotaleLiv2Flatten() {
    // Object.keys(DATA_NORMALIZZATA.liv2) = ["A1.1", "A1.2", ....", "B2.1", ... "C1.1", "C1.2", ...] ALL "liv2"
    let dominioLiv2 = Object.keys(DATA_NORMALIZZATA.liv2);
    dominioLiv2.sort(compareArrayOfString);
    return getFlattenGerarchia(dominioLiv2);
}
export const legendaLiv2Flatten = creaLegendaTotaleLiv2Flatten();
