let fileIp = document.getElementById('uploadfile'),
    csvData = {};
let ourTable = document.querySelector('.datatable_container table');
console.log('weather prediction js file loaded.')

function resetTable(){
    ourTable.innerHTML = '';
}

fileIp.onchange = function(e){
    
    let file = e.target.files[0];
    let freader = new FileReader();
    // reset the table if we select another csv file to be show in table without refreshing the page!!
    setTimeout(_ => resetTable(), 1000); // 1 second  after closing file dialog, previous table will get removed!!
    freader.onload = function(fe){
        csvData = csv2obj(fe.target.result);
        console.log(csvData);
        setTimeout(_ => createTableWithData(csvData), 1000); // after 1 second, new table will render    
    }

    freader.readAsText(file);
    
}

// PPIQ.SQUII1200,"PPI output index level 3 - Rail, water, air and other transport",2020.06,1237,1238
function msplit(stringToBeSplited, delimiter){
    let chBlackListed = '\'\"', // string of single quote and double quote i.e., "'""
        finalSplits = [], 
        stringBuffer = '', 
        blfound = [], 
        strarr = Array.from(stringToBeSplited), 
        szOfStr = stringToBeSplited.length;
    function saveStr(s){
        finalSplits.push(s);
    }
    strarr.forEach((currentCharacter, i) => {
        //console.log('stringBuffer:', stringBuffer);
        if(chBlackListed.indexOf(currentCharacter) !== -1) // if current char is a quote
            // match two double/single quotes so we will find the whole string in b/w caontaining delimiter (here comma)            
            if(blfound.length) // if its end quote
                blfound.pop(); // remove the start quote from array
            else // else if its start quote
                blfound.push(currentCharacter); // save hte start quote inside array
        else{ // if it is not a quote
            if(currentCharacter !== delimiter) // then check if current char is not a delimiter (here comma)
                stringBuffer += currentCharacter; // keep concatenating the characters to the string buffer
            else{ // if it is a delimiter (here comma)
                // terminate the string and save
                if(blfound.length !== 0)// if it is the case then it's getting characters b/w quotes so we dont want to complete the string
                    stringBuffer += currentCharacter; // save the delimiter because its part of quoted string
                else{
                    saveStr(stringBuffer); // all strings are saved here one by one except last one
                    // reset the string buffer variable
                    stringBuffer = '';
                }
            }
            if(i === szOfStr - 1) // last character hit
                saveStr(stringBuffer); // save the last string here
        } 
    });
    return finalSplits;
}

let clone = o => JSON.parse(JSON.stringify(o));

function csv2obj(csv){
    let rws = csv.split('\n');
    let headings = rws[0].split(',').map(heading => heading.trim());
    let tmpObj = {}, 
        tmparr=[];
    
    headings.forEach(heading => {
        tmpObj[heading] = [];
    });
    for(let i=1; i<rws.length; ++i){
        tmparr = msplit(rws[i], ',');
        tmparr.forEach((val, j) => {
            tmpObj[headings[j]].push(val);
        });
    }
    return tmpObj;
}

/*
just for reference 
<tr> // first create this
    <th>Firstname</th> // then these
    <th>Lastname</th>
    <th>Age</th>
  </tr>
*/

// here in this function we'll setup the table we need
function createTableWithData(data){
    let headings = Object.keys(data).sort(); // this will get all the keys from any object (here data)
    let numOfRows = data[headings[0]].length;
    // lets first create only headings of our table
    // just to see how it is going to render

    let tableHeadingsContainer = document.createElement('tr'); // this will contain the th
    let th = null;
    headings.forEach(heading => {
        th = document.createElement('th');
        // now we have the th. so lets put the heading into it
        th.textContent = heading;
        // now we have the heading, lets put that as a child of our tableheadings container
        tableHeadingsContainer.appendChild(th);
    });
    // now until now we have our tr containing all the ths
    // so its time for attaching this tr as a child of our table
    ourTable.appendChild(tableHeadingsContainer); // that is it!!!!!

    // now lets create the rows
    let dataRow = null, dataField = null;

    function getDataRowCreated(rowNumber){
        let tmp = document.createElement('tr');
        headings.forEach(heading => {
            dataField = document.createElement('td');
            dataField.textContent = data[heading][rowNumber];
            tmp.appendChild(dataField);
        });
        return tmp;
    }

    // replace/update this table rendering code with pagination
    // lets run a for loop numOfRows times
    for(let rowNumber=0; rowNumber<numOfRows; ++rowNumber){
        dataRow = getDataRowCreated(rowNumber)
        if(rowNumber%2)
            dataRow.classList.add('odd_row');
        else
            dataRow.classList.add('even_row');

        ourTable.appendChild(dataRow);
    }

}

