var Client   = require('./models/client'),
    Product  = require('./models/product'),
    Appserver= require("./models/appserver"),
    DBserver = require("./models/dbserver"),
    Credprofile = require("./models/credprofile");

var data = [
    /*{
        name: "Jasons Casino",
        supportPlan: 'Business Premium',
        status: 'In Support',
        timezone: 'GMT -08:00 Pactific(US & Canada)',
        ccm: 'Tom Smith',
        configLead: 'Billy Ham',
        installLead: 'Julie Happy',
        licenseType: 'Company',
        vpnAccess: 'Shared VPN Creds',
        rdpAccess: 'Shared RDP Access',
        requestMethod: 'Email',
        properties: 6,
        it_24_7: 'Yes',
        specialreq: 'Client Form',
        clientit: "Email us and we connect you!",
        adclient: "Yes",
        connection: "Bacon ipsum dolor amet pancetta tenderloin short loin, meatball tongue turkey pastrami t-bone short ribs cupim burgdoggen. Pancetta pork loin shankle t-bone, kielbasa picanha hamburger. Meatloaf filet mignon andouille shankle pastrami, ham burgdoggen beef short ribs sausage kevin. Frankfurter meatball beef turkey, hamburger bacon pig flank porchetta."
        },
        {
        name: 'Nanas Casino',
        supportPlan: 'Business Standard',
        status: 'In Support',
        timezone: 'GMT -12:00 Pactific(US & Canada)',
        ccm: 'Jean Thomas',
        configLead: 'Terry Club',
        installLead: 'Ken Sad',
        licenseType: 'Company',
        vpnAccess: 'Shared VPN Creds',
        rdpAccess: 'Shared RDP Access',
        requestMethod: 'Call',
        properties: 2,
        it_24_7: 'Yes',
        adclient: "Yes",
        specialreq: 'Formated Email',
        clientit: "Rump tri-tip pig kevin short ribs drumstick alcatra. T-bone landjaeger ham shankle, short loin chuck burgdoggen pork tri-tip tongue biltong. Tenderloin ball tip burgdoggen beef boudin t-bone shankle cow. Beef rump pork chop tail.",
        connection: "Capicola ham hock tail chicken t-bone salami beef short ribs. Turducken andouille tri-tip, flank brisket sirloin boudin pork loin burgdoggen. Venison beef ribs landjaeger picanha brisket tri-tip, turkey alcatra meatloaf prosciutto pastrami pork belly swine shank. Kevin tenderloin pork, shank prosciutto filet mignon chicken sausage ground round meatball doner short loin shoulder beef ribs. Meatloaf andouille boudin, pork chop biltong turkey pig landjaeger ham buffalo sausage ribeye. Boudin pastrami spare ribs hamburger cow sirloin alcatra tongue turkey ribeye short ribs pork loin meatloaf shoulder."
        },*/
        {
        name: 'Johns Casino',
        supportPlan: 'Business OPs',
        status: 'In Support',
        timezone: 'GMT +05:00 Pactific(US & Canada)',
        ccm: 'Harry Potter',
        configLead: 'Stone Cold',
        installLead: 'The Rock',
        licenseType: 'Individual',
        vpnAccess: 'AnyConnect',
        rdpAccess: 'Individual RDP Access',
        requestMethod: 'Email',
        properties: 6,
        it_24_7: 'No',
        specialreq: 'N/A',
        adclient: "No",
        clientit: "Chuck chicken spare ribs prosciutto. Tenderloin ham pork loin shankle spare ribs drumstick picanha burgdoggen chuck. Turkey tri-tip buffalo ham picanha. Pastrami shankle leberkas corned beef picanha ham hock turducken beef rump sirloin pork belly shoulder drumstick. Tri-tip doner chuck shankle short ribs pancetta ham hock. Strip steak biltong ground round ball tip.",
        connection: "Jowl bresaola pork loin, shoulder fatback ball tip drumstick spare ribs pancetta shank beef ribs meatball kevin. Ham fatback frankfurter jerky picanha. Pancetta tri-tip hamburger fatback ground round boudin pork belly salami beef ribs corned beef venison filet mignon beef short loin pastrami. Shankle short ribs ham bresaola jowl tenderloin, rump pork belly jerky corned beef fatback pork chop kevin porchetta tri-tip. Spare ribs filet mignon pork loin, cow doner fatback t-bone prosciutto buffalo burgdoggen venison boudin beef ribs. Chicken flank capicola ham hock. Shank short loin ham hock tail sausage beef turducken ground round ham spare ribs shankle landjaeger shoulder chicken."
    },
];

function seedDB(){
    //removes all exisiting clients
    Client.remove({}, function(err){
        if(err){
            console.log(err);
        } else{
            Product.remove({});
            console.log('The Client Table has dropped');
            //creating dummy clients
            data.forEach(function(seed){
                if(err){
                    console.log(err);
                }
                console.log('Adding New Client');
                Client.create(seed, function(err, client){
                    if(err){
                        console.log(err);
                    } else{
                        console.log('New Client Added to Table');
                        //adding product info
                        Product.create({
                            name: "TecViz",
                            type: "Production",
                            uiversion: "8.8.85",
                            beversion: "3.25.1",
                            url: "techViz.casino.com",
                            maker: "techViz.casino.com/maker",
                            makerver: "2.1.5",
                            flowviz: "techViz.casino.com:5015",
                            flowvizver: "2.1.3",
                            flowvizun: "happy",
                            flowvizpd: "days",
                            rabbit: "techViz.casino.com:2630",
                            rabbitun: "going",
                            rabbitpd: "home",
                            note: "Bacon ipsum dolor amet shankle tri-tip short ribs leberkas pork belly tenderloin. Turducken chicken tail meatloaf buffalo, shank jerky hamburger salami. Kevin beef ribs t-bone, ball tip cow hamburger flank tri-tip prosciutto pork chop pork kielbasa doner ribeye. Beef landjaeger pork belly beef ribs boudin ribeye ground round buffalo jowl."
                        }, function(err, product){
                            if(err){
                                console.log(err);
                            } else {
                                client.products.push(product);
                                console.log('New Product Added');
                                //adding product info
                                Product.create({
                                    name: "HostViz",
                                    type: "Test",
                                    uiversion: "8.8.2",
                                    beversion: "2.1.1",
                                    url: "hostViz.casino.com",
                                    maker: "hostViz.casino.com/maker",
                                    makerver: "2.1.5",
                                    flowviz: "",
                                    flowvizver: "",
                                    flowvizun: "",
                                    flowvizpd: "",
                                    rabbit: "",
                                    rabbitun: "",
                                    rabbitpd: "",
                                    note: "Kevin ground round brisket capicola pancetta spare ribs. Drumstick pancetta shankle, cupim ground round jerky leberkas pork belly turducken sausage ham. Strip steak pork chop landjaeger meatball ham boudin chuck biltong ground round. Salami ham hock drumstick pork chop burgdoggen cupim. Flank sirloin meatball ground round, spare ribs ham hock pork belly andouille chuck picanha cow shank shankle."  
                                }, function(err, product){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        client.products.push(product);
                                        console.log('New Product Added');
                                        Appserver.create({
                                            type: "Production",
                                            role: client.name,
                                            rdpip: "10.10.10.1.2",
                                            rdphostname: "ProdHost Tech",
                                            rdpdomain: "MyCompany",
                                            ram: "256 gb",
                                            cpu: "intel i7",
                                            disk: "2 tb",
                                            os: "Windows 10",
                                            apppath: "D:/",
                                            notes: "Prosciutto meatball spare ribs rump cow bresaola salami ham hock. Ground round shoulder pork doner drumstick beef ribs venison cow pancetta, biltong picanha. Chicken swine hamburger pig drumstick jowl t-bone picanha short ribs biltong ham hock andouille shankle corned beef. Short ribs fatback shank t-bone. Picanha jowl turducken, drumstick ham hock hamburger tongue porchetta pork belly pork chop biltong shank bacon andouille ground round.",
                                        }, function(err, appserver){
                                            if(err){
                                                console.log(err);
                                            } else {
                                                client.appservers.push(appserver);
                                                console.log('New Production Appserver Added');
                                                Appserver.create({
                                                    type: "Test",
                                                    role: client.name,
                                                    rdpip: "Test 10.10.10.1.3",
                                                    rdphostname: "Test ProdHost Tech",
                                                    rdpdomain: "Test MyCompany",
                                                    ram: "Test 256 gb",
                                                    cpu: "Test intel i7",
                                                    disk: "Test 2 tb",
                                                    os: "Test Windows 10",
                                                    apppath: "Test D:/",
                                                    notes: "Test  -----  Prosciutto meatball spare ribs rump cow bresaola salami ham hock. Ground round shoulder pork doner drumstick beef ribs venison cow pancetta, biltong picanha. Chicken swine hamburger pig drumstick jowl t-bone picanha short ribs biltong ham hock andouille shankle corned beef. Short ribs fatback shank t-bone. Picanha jowl turducken, drumstick ham hock hamburger tongue porchetta pork belly pork chop biltong shank bacon andouille ground round.",
                                                }, function(err, appserver){
                                                    if(err){
                                                        console.log(err);
                                                    } else {
                                                        client.appservers.push(appserver);
                                                        console.log('New Test Appserver Added');
                                                        DBserver.create({
                                                            type: "Production",
                                                            dbtype: "Microsoft",
                                                            dbversion: "3.45",
                                                            ip: "1.5.51.64",
                                                            hostname: "MyDB",
                                                            port: 1040,
                                                            dbname: "Database",
                                                            dbschema: "N/A",
                                                            jdbcurl: "kkljdskfjsijsdkmfsdksdksafkm",
                                                            ram: "500",
                                                            cpu: "2 intel i7",
                                                            disk: "c:/ = 1 tb  /  d:/ = 500gb",
                                                            os: "Windows 10",
                                                            notes: "Spicy jalapeno bacon ipsum dolor amet ground round elit andouille drumstick labore swine bacon sirloin cupim dolore ipsum tempor meatball shoulder ham. Alcatra et hamburger nulla. Leberkas consectetur shoulder porchetta proident. Tri-tip prosciutto pariatur leberkas ground round do meatloaf esse aliquip porchetta eu frankfurter culpa. Ipsum turducken boudin cupim, pork belly shoulder sausage do pariatur capicola chuck exercitation eiusmod anim brisket. Quis sunt reprehenderit, jerky pig enim andouille ullamco qui brisket esse pork belly in venison pork chop."
                                                        }, function(err, dbserver){
                                                            if(err){
                                                                console.log(err);
                                                            } else {
                                                                client.dbservers.push(dbserver);
                                                                console.log('New Production DBserver Added');
                                                                DBserver.create({
                                                                    type: "Test",
                                                                    dbtype: "Test Microsoft",
                                                                    dbversion: "Test 3.45",
                                                                    ip: "Test 1.5.51.64",
                                                                    hostname: "Test MyDB",
                                                                    port: 4010,
                                                                    dbname: "Test Database",
                                                                    dbschema: "Test N/A",
                                                                    jdbcurl: "Test - kkljdskfjsijsdkmfsdksdksafkm",
                                                                    ram: "Test 500",
                                                                    cpu: "Test 2 intel i7",
                                                                    disk: "Test c:/ = 1 tb  /  d:/ = 500gb",
                                                                    os: "Test Windows 10",
                                                                    notes: "Porchetta frankfurter bresaola id cow eiusmod lorem dolore adipisicing. Pork loin cupidatat consequat, short loin occaecat do exercitation in consectetur velit irure excepteur esse. Cow beef est shank ground round anim. Enim occaecat shankle fatback filet mignon ipsum nisi elit."
                                                                }, function(err, dbserver){
                                                                    if(err){
                                                                        console.log(err);
                                                                    } else {
                                                                        client.dbservers.push(dbserver);
                                                                        client.save()
                                                                        console.log('New Test DBserver Added');
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });    
            });
        }
    });
    Credprofile.remove({}, function(err){
        if(err){
           console.log(err)
        } else {
            var admin = 23456;
            var user = 12345;
            Credprofile.create({user: user, admin: admin}, function(err, newprofile){
                if(err){
                    console.log(err);   
                } else {
                    console.log('New Profile Added');
                }
            });
        }
    });
}

module.exports = seedDB;