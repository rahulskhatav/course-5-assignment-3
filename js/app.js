(function(){
    angular.module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService)
    .directive("listDisplay", listDisplay);

    function listDisplay(){
        var ddo = {
            templateUrl: ("directive.html"),
            scope : {
                list: "<",
                onRemove: "&",
                status : "<"
            }
        };
        return ddo;
        
    }


    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        //controller as syntax
        var ctrl = this;

        ctrl.searchTerm = "";

        ctrl.show = function(){
            if(ctrl.searchTerm){
                ctrl.list = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
            }
            else{
                ctrl.list = [];
            }
            //calls for getMacthedMenuItems function of MenuSearchService
            if(ctrl.list.length===0){
                ctrl.status = 0;
            }
            //console.log(ctrl.list);
        };
        ctrl.remove = function(index){
            ctrl.list.splice(index, 1);
        };
        

    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http){
        var service = this;
        service.getMatchedMenuItems = function(searchTerm){
            var foundItems = [];
            var promise = $http({
                method : "GET",
                url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
            });

            promise.then(function(response){
                service.menu = response.data;
                for(var i=0; i<220; i++){
                    if(service.menu.menu_items[i]){
                        var str = service.menu.menu_items[i].description;
                    var pos = str.indexOf(searchTerm);
                    if(pos!=-1){
                        var item = {
                            id: service.menu.menu_items[i].id,
                            shortname: service.menu.menu_items[i].short_name,
                            name: service.menu.menu_items[i].name,
                            descp : service.menu.menu_items[i].description
                        };
                        foundItems.push(item);
                    }
                }
                    
                };
                //console.log(service.menu);
            })
            .catch(function(error){
                console.log(error);
            });

            return foundItems;
        }
    };


})()