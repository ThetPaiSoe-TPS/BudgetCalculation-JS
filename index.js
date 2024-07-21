// Budget Controller
var budgetController= (function(){
    var Expense= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
    }
    var Income= function(id, description, value){
        this.id= id;
        this.description= description;
        this.value= value;
    }
    var data= {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    //receive data as a public
    return{
        addItem: function(type, des, val){
            var newItem, ID;
            ID= 0;
            //create new ID
            if(data.allItems[type].length> 0){
                ID= data.allItems[type][data.allItems[type].length-1].id +1;
            }
            else{
                ID= 0;
            }
            
            //create new item base inc or exp
            if(type=== "inc"){
                newItem= new Income(ID, des, val);
            }
            else if(type=== "exp"){
                newItem= new Expense(ID, des, val);
            }
            //push it into our data structure
            data.allItems[type].push(newItem);
            //return new element
            return newItem;
        }
    }

})();

// UI Controller
var UIController= (function(){
    //DOM easy to find
    var DOMString= {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeElement: ".income__list",
        expenseElement: ".expenses__list"
    }
    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMString.inputType).value,
                descritpion: document.querySelector(DOMString.inputDescription).value,
                value: document.querySelector(DOMString.inputValue).value
            }
        },
        getDOMString: function(){
            return DOMString;
        },
        addListItem: function(obj, type){
            var html, newHTML, element;
            //create HTML String with placeholder text
            if(type=== "inc"){
                element= DOMString.incomeElement;
                html= '<div class="item clearfix" id="income-%id%">         <div class="item__description">%description%</div>           <div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete">        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>           </div></div>         </div>';
            }
            else if(type=== "exp"){
                element= DOMString.expenseElement;
                html= '<div class="item clearfix" id="expense-%id%">                         <div class="item__description">%description% </div>                            <div class="right clearfix">                                <div class="item__value">- %value%</div>                                <div class="item__percentage">21%</div>                                <div class="item__delete">                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>                                </div>                            </div>                        </div>';
            }
        

        
            //replace placeholder text with actual data
            newHTML= html.replace("%id%", obj.id);
            newHTML= newHTML.replace("%description%", obj.description);
            newHTML= newHTML.replace("%value%", obj.value);
            //insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
        }
    }
})();

//Global App Controller
var controller= (function(budgetCtrl, UICtrl){

    var ctrlAddItem= function(){
        var input, newItem;
        //1. get the field input data
        input= UICtrl.getInput();
        //2. add item to the budget controller
        newItem= budgetCtrl.addItem(input.type, input.descritpion, input.value);
        //3. add item to the UI
        UICtrl.addListItem(newItem, input.type);
        //4. calculate the budget
        //5. display the budget to the UI
        }

    var setupEventListener= function(){
        var DOM= UICtrl.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13 || event.which=== 13){
                ctrlAddItem();
            }
        })
    }

    //public
    return{
        init: function(){
            setupEventListener();
        }
        
    }
    
})(budgetController, UIController);

controller.init();