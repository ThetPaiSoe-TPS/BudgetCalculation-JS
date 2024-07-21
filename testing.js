//Budget controller
var budgetController= (function(){
    //creating function constructor to store UI's receiving data
    var Expense= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
        this.percentage= -1;
    }
    //calculate percentage
    Expense.prototype.calPercentage= function(totalInc){
        if(totalInc> 0){
            this.percentage= Math.round((this.value/ totalInc)* 100);
        }
        else{
            this.percentage= -1;
        }
    }
    Expense.prototype.getPercentage= function(){
        return this.percentage;
    }
    //return new prototype
   
    var Income= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
    }

    var data= {
        //to store income and expense in array
        allItems: {
            exp: [],
            inc: []
        },
        //to combine array index
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
     
    var calculateTotal= function(type){
        var sum= 0;
        data.allItems[type].forEach((cur)=>{
            sum+= cur.value;
            data.totals[type]= sum;
        })
        
        
    }
    //to make public
    return{
        //storing data in income and expense
        addItem: function(type, des, val){
            var newItem, ID;
            //add new ID
            if(data.allItems[type].length> 0){
                ID= data.allItems[type][data.allItems[type].length- 1].id+1;
            }
            else{
                ID= 0;
            }

            //store income or expense data
            if(type=== "inc"){
                newItem= new Income(ID, des, val);
            }
            else if(type=== "exp"){
                newItem= new Expense(ID, des, val);
            }
           //push income or expense to the data seperately
            data.allItems[type].push(newItem);
             //store incoming data to private data
            return newItem;
        },
        deleteItem: function(type, id){
            var ids= data.allItems[type].map((curr)=>{
                return curr.id;
            });
            var index= ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        testing: function(){
            return data.totals;
        },
        calculateBudget: function(){
            //1. calculate total income and expense
            calculateTotal("inc");
            calculateTotal("exp");
            //2. calculate budget- income - expense
            data.budget= data.totals.inc- data.totals.exp;
            //3. calculate the percentage of income that we spent
            if(data.budget< 0){
                data.percentage= -1;
            }
            else{
                data.percentage= Math.round((data.totals.exp/ data.totals.inc)* 100);
            }

        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,   
            }
        },
        calculatePercentage: function(){
            data.allItems.exp.forEach((cur)=>{
                cur.calPercentage(data.totals.inc);
            })
        },
        getPercentage: function(){
            var eachPercentage= data.allItems.exp.map((cur)=>{
                return cur.getPercentage();
            })
            return eachPercentage;
        }
    }
    
})();


//UI controller
var UIController= (function(){
    //DOM easy to change
   var DOMString= {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeElement: ".income__list",
    expenseElement: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensePercLabel: ".item__percentage",
    budgetMonth: ".budget__title--month"
   }

   var num, numSplit, int, dec, type;
    var formatNumber= function(num, type){
        // + or - before value
        // 2 decimal point 
        // comma seperating thousands

        num= Math.abs(num);
        num= num.toFixed(2);
        numSplit= num.split(".");
        int= numSplit[0];
        if(int.length> 3){
            int= int.substr(0, int.length-3)+ ","+ int.substr(int.length-3, int.length);
        }
        dec= numSplit[1];
        return (type=== "exp"? "-": "+")+ " "+ int+"."+ dec;
    }
    

    //to show public, to link app controller
    return {
        getInput: function(){
            //to show public each value
            return {
                type: document.querySelector(DOMString.inputType).value,
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)
            }
        },
        getDOMString: function(){
            return DOMString;
        },
        addListItem: function(obj, type){
            var html, newHTML, element;
            //create HTML string with placeholde text
            if(type=== "inc"){
                element= DOMString.incomeElement;
                html= '<div class="item clearfix" id="inc-%id%">                            <div class="item__description">%description%</div>                            <div class="right clearfix">                                <div class="item__value">%value%</div>                                <div class="item__delete">                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>                                </div>                            </div>                        </div>';
            }
            else if(type=== "exp"){
                element= DOMString.expenseElement;
                html= '<div class="item clearfix" id="exp-%id%">                            <div class="item__description">%description%</div>                            <div class="right clearfix">                                <div class="item__value">%value%</div>                                <div class="item__percentage">21%</div>                                <div class="item__delete">                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>                                </div>                            </div>                        </div>';
            }
            
            //replace placeholder text with actural data
            newHTML= html.replace("%id%", obj.id);
            newHTML= newHTML.replace("%description%", obj.description);
            newHTML= newHTML.replace("%value%", formatNumber(obj.value, type));
            //inset html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);

        },
        deleteListItem: function(selectorID){
            var el= document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function(){
            var fields, fieldsArr;
            fields= document.querySelectorAll(DOMString.inputDescription+","+ DOMString.inputValue);

            fieldsArr= Array.prototype.slice.call(fields);
            fieldsArr.forEach((current, index, array) => {
                current.value= "";
                fieldsArr[0].focus();
            });
            
        },
        displayBudget: function(obj){
            document.querySelector(DOMString.budgetLabel).textContent= formatNumber(obj.budget, type);
            document.querySelector(DOMString.incomeLabel).textContent= formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMString.expenseLabel).textContent= formatNumber(obj.totalExp, "exp");
            if(obj.percentage> 0){
                document.querySelector(DOMString.percentageLabel).textContent= obj.percentage+"%";
            }
            else{
                document.querySelector(DOMString.percentageLabel).textContent= "---";
            }
        },
        displayPercentage: function(percentage){
            var fields= document.querySelectorAll(DOMString.expensePercLabel);

            //creating nodelist with forEach()
            // let rst= "";
            fields.forEach((function (cur, index){
                cur.textContent= percentage[index]+"%";
                // rst= cur.textContent;
            }))
            // console.log(rst);
        },
        displayMonth: function(){
            var date= new Date();
            let months= ["January","February","March","April","May","June","July","August","September","October","November","December"];
            let month= months[date.getMonth()];
            let year= date.getFullYear();
        document.querySelector(DOMString.budgetMonth).textContent= month+ " in "+ year;             
        }
        
    }
    

})();
UIController.clearFields();

//App controller
var controller= (function(budgetCtrl, UICtrl){
    var input, newItem, budget;
    
    var updateBudget= function(){
         //1. calculate the budget
         budgetCtrl.calculateBudget();
         //2. retur budget
         budget= budgetCtrl.getBudget();
        //3. display budget to the UI
        // console.log(budget);
        UICtrl.displayBudget(budget);
    }
    var updatePercentages= function(){
        // 1.calculate percentage
        budgetCtrl.calculatePercentage();
        // 2. read percentage from budget controller
        var percentage= budgetCtrl.getPercentage();
        // console.log(percentage);
        // 3. update the UI with new percentage
        UICtrl.displayPercentage(percentage);

    }
    // console.log(budgetCtrl.calculatePercentage());
    //function for do-to-list under keypress
    var ctrlAddItem= function(){
        //1. get the field input data
        input= UICtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value> 0){
            // console.log(input);
            //2. add item to the budget controller
            newItem= budgetCtrl.addItem(input.type, input.description, input.value);
            //3. add item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4. clear fields
            UICtrl.clearFields();
            //5. calcute and update Budget
            updateBudget();
            //6. calculate and update percentage
            updatePercentages();
        }
        
    }

    //catching parent's id from child node
    var ctrlDeleteItem= function(e){
        var itemID, splidID, type, ID;
        itemID= e.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splidID= itemID.split("-");
            type= splidID[0];//getting only inc or exp
            ID= parseFloat(splidID[1]);
            //1. delete item from datastructure
            budgetCtrl.deleteItem(type, ID);
            //2. delete item from UI
            UICtrl.deleteListItem(itemID);
            //3. updat and show to new Budget
            updateBudget();
            //4. calculate and update percentage
            updatePercentages();
        }//because it come like "inc-0"=> split=> inc, 0 
        // console.log(itemID);
    }

    //to be shorten code makes collection
    var setupEventListener= function(){
        // calling html class name through UIcontroller through the getDOMString function
        var DOM= UICtrl.getDOMString();
           //click function
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        //setup enterkey
        document.addEventListener("keypress", function(e){
            if(e.keyCode=== 13 || e.which=== 13){
                ctrlAddItem();
            }
        })
        //delete function
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    } 

    //go public
    return {
        init: function(){
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListener();
            UICtrl.displayMonth();
        }
    }
    
})(budgetController, UIController);
controller.init();

