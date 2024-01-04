
$( document ).ready(function() {

    console.log( "ready!" );

    function ListarAllUsers() {
        $("#listini").empty()
        $("#deluserlist").empty()
        $("#divUserUpdateList").empty()
        $.get("https://localhost:44340/api/v1/notes/getNotes", function( data ){
            let z = 0;
            //ListaGet
            for (z = 0; z < data.length; z++){
                $("#listini").append('<li> Id: ' + data[z]["id"] + '</li>' + '<li> Note Title: ' + data[z]["title"] + '</li>' + '<li> Archived: ' + data[z]["archived"] + '</li>' + '<li> CategoryId: ' + data[z]["categoryId"] + '</li>' ); //en otro div pero en forma de list
            };
            //ListaDel
            z = 0;
            for (z = 0; z < data.length; z++){
                $("#deluserlist").append('<li> ' + '<button id="btnDel'+ data[z]["id"] +'">Del Id "' + data[z]["id"] + '"</button>' + '</li>' + '<li> UserName: ' + data[z]["userName"] + '</li>'); //en otro div pero en forma de list
            };
            //ListaUpdate
            z = 0;
            for (z = 0; z < data.length; z++){
                $("#divUserUpdateList").append('<li> ' + '<button id="btnUpdateNumber'+ data[z]["id"] +'">Update Id "' + data[z]["id"] + '"</button>' + '</li>' + '<li> UserName: ' + data[z]["userName"] + '</li>'); //en otro div pero en forma de list
            };
        });   
    };
    ListarAllUsers()

// GET USERS-----------------------------------------------------------------------------------------------
    $("#btnallusers").click(function(){
        $("#listaDeUsuarios").toggle();
    });
//---------------------------------------------------------------------------------------------------------

//POST USER------------------------------------------------------------------------------------------------
    $("#btnpostuser").click(function(){
        $("#postuserform").toggle();
    });

    $(document).on('click', "#buttonSubmitPost", function() {
        var usernameForm = $("#postUserName").val();
        var firstName = $("#postFirstName").val();
        var lastName = $("#postLastName").val();
        var country = $("#postCountry").val();
        var state = $("#postState").val();
        var city = $("#postCity").val();
                
        $.ajax({
            'url':'https://localhost:7233/api/AddUser',
            'method':'POST',
            'dataType': 'json',
             processData: false,
             'contentType': 'application/json',
             'data':JSON.stringify({
                "UserName":usernameForm,
                "FirstName":firstName,
                "LastName":lastName,
                "Country":country,
                "State":state,
                "City":city
                }),
                success: function(msg){
                    alert( "Data Saved: " + msg );
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("some error: " + XMLHttpRequest.responseText);
                }
        });
        ListarAllUsers()
    });
//---------------------------------------------------------------------------------------------------------   
   
//DELETE USER----------------------------------------------------------------------------------------------  

    $("#btndeluser").click(function(){
        $("#listaUsuariosABorrar").toggle();
    });

    $(document).on('click', "[id*='btnDel']", function() {

        let idDelete;
        idDelete =this.id.replace("btnDel","");
        $.ajax({
            'url':'https://localhost:7233/api/DeleteUser' + idDelete,
            'method':'DELETE',
            processData: false,
            'contentType': 'application/json',
            success: function(msg){
            alert( "Data Saved: " + msg );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("some error: " + XMLHttpRequest.responseText);
            }
        });
        ListarAllUsers()         
    });

//---------------------------------------------------------------------------------------------------------

//Update User----------------------------------------------------------------------------------------------
    $("#btnUpdateUser").click(function(){
        $("#divUserUpdateList").toggle();
        $("#formUpdate").toggle();
    });

        // me parece que esta entrando mal cuando compara ID y posicion en el JSON DATA  , estoy recorriendo DATA con el valor de ID o algo asi? id y recorrido son iguales ?
    $(document).on('click', "[id*='btnUpdateNumber']", function() {
        let idUpdate;
        idUpdate =this.id.replace("btnUpdateNumber","");
        console.log("aca" + idUpdate)
        // buscando index del array data donde se encuentra objeto, al final use el index para todo estaba mal usar el ID para posicion de array
        $.get("https://localhost:7233/api/GetAllUsers", function( data ){

            var index;
            data.findIndex(function (entry, i) {
            if (entry.id == idUpdate) {
                index = i;
                return true;
                }
            });
            console.log("Test arr Index:" + index);
            console.log("index:" + data[index]["id"]);
            console.log(idUpdate);
            console.log(data[index]["userName"]);
            
            //mostrando valores actuales en el form
            $("#updateUserId").val(idUpdate); //puedo usar data[index]["id"] / probar
            $("#updateUserName").val(data[index]["userName"]); // ahi lo arregle?// esto esta mal , idupdate esta referido al ID no una posicion de DATA tendria q ser la posicion del array donde esta ese id y username
            $("#updateFirstName").val(data[index]["firstName"]);
            $("#updateLastName").val(data[index]["lastName"]);
            $("#updateCountry").val(data[index]["country"]);
            $("#updateState").val(data[index]["state"]);
            $("#updateCity").val(data[index]["city"]);
            //termina mostrando valores actuales en el form
        });
        
        // esta Funcando bien , hay que revisar bien el html que es un asco de formularios, necesario un form para cada metodo? no creo..                    
        $("#buttonSubmitUpdate").click(function(){
            var usernameForm = $("#updateUserName").val();
            var firstName = $("#updateFirstName").val();
            var lastName = $("#updateLastName").val();
            var country = $("#updateCountry").val();
            var state = $("#updateState").val();
            var city = $("#updateCity").val();
            
            $.ajax({
                'url':'https://localhost:7233/api/UpdateUser',
                'method':'PUT',
                'dataType': 'json',
                processData: false,
                'contentType': 'application/json',
                'data':JSON.stringify({
                    "Id":idUpdate, //es la var que tengo de antes
                    "UserName":usernameForm,
                    "FirstName":firstName,
                    "LastName":lastName,
                    "Country":country,
                    "State":state,
                    "City":city
                    }),
                    success: function(msg){
                        alert( "Data Saved: " + msg );
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("some error: " + XMLHttpRequest.responseText);
                    }
            });
            ListarAllUsers()
        });
    });

});


            
                













            
            
       




    /*
    $.get( "https://localhost:7233/api/GetAllUsers", function( data ) 
    {
        let i = 0; // init en 0
        for (i = 0; i < data.length; i++)
        {   
            $("#result").append(data[i]["id"]); //el object id esta ok pero no graficaba porq con data solo no trae todo el json es necesario poner por partes asi

        }
        let activador = false; // para que no traiga la info denuevo cuando apretas btnalluser
        // boton para todos los usuarios
        $("#btnallusers").click(function(){
            let z = 0;
            if (!activador) //esta cabezada se llama flag - deberia ser BOOL TRUE or FALSE
            {
                for (z = 0; z < data.length; z++)
                {
                    $("#listini").append('<li> Id: ' + data[z]["id"] + '</li>' + '<li> UserName: ' + data[z]["userName"] + '</li>' + '<li> FirstName: ' + data[z]["firstName"] + '</li>'); //en otro div pero en forma de list
                }
                activador = true;  
            }
            
            $("#listini").toggle();
        });
                
        // post un User
        $("#btnpostuser").click(function(){
            $("#postuserform").toggle();
            $("#buttonSubmit").click(function(){
                var usernameForm = $("#userName").val();
                var firstName = $("#firstName").val();
                var lastName = $("lastName").val();
                var country = $("country").val();
                var state = $("state").val();
                var city = $("city").val();
                
                $.ajax({
                    'url':'https://localhost:7233/api/AddUser',
                    

                    'method':'POST',
                    'dataType': 'json',
                    processData: false,
                    'contentType': 'application/json',
                    'data':JSON.stringify({
                        "UserName":usernameForm,
                        "FirstName":firstName,
                        "LastName":lastName,
                        "Country":country,
                        "State":state,
                        "City":city
                        }),
                        success: function(msg){
                            alert( "Data Saved: " + msg );
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert("some error: " + XMLHttpRequest.responseText);
                        }
                });
                //'success': getHandlingStatus
            });   
        });
        //delete user
        activador = false;
        let z = 0;
        $("#btndeluser").click(function(){
            $("#divuserlist").toggle();
            
            if (!activador) //esta cabezada se llama flag - deberia ser BOOL TRUE or FALSE
            {
                for (z = 0; z < data.length; z++)
                {
                    $("#deluserlist").append('<li> ' + '<button id="btnDel'+ z +'">Del Id "' + z + '"</button>' + '</li>' + '<li> UserName: ' + data[z]["userName"] + '</li>'); //en otro div pero en forma de list
                }
                activador = true;  
            }
            
            
            $('[id*="btnDel"]').click(function(){
                
                //console.log("entro");
                //console.log(this.id);
                let idDelete = this.id.substr(this.id.length - 1);
                console.log(idDelete);

                $.ajax({
                    'url':'https://localhost:7233/api/DeleteUser/' + idDelete,
                    'method':'DELETE',
                    processData: false,
                    'contentType': 'application/json',

    
                        success: function(msg){
                            alert( "Data Saved: " + msg );
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert("some error: " + XMLHttpRequest.responseText);
                        }
                });

            });
            
                
        });
            



    });*/
    //});
                        




