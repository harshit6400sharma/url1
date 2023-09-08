//UAT
export let constant = {
    emailvalidateregex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    mobilevalidateregex: /^\d{10}$/,
    spacebetweenwordsregex: /^\w+(\s\w+)*$/,
    pannumberregex: /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/,
    onlyalphabetregex:/^[A-Za-z]+$/,
    gstval: 18,
    APIKEY: "d7bdba0581ed4ba7a0b30d7197df6269", //UAT
    SECRETKEY: "595fc759a2e44a2eac1d49e6eb412487", //UAT
    star_endpoint: 'https://igsan.starhealth.in', //UAT
    star_JWT_userid:"APIKEY_LB0000000040",
    star_JWT_password:"htmI8WzaaRbeCvMkefxFoQ==",
    religare_endpoint:'https://apiuat.religarehealthinsurance.com', //UAT
    religare_payment_url:'https://apiuat.religarehealthinsurance.com/portalui/PortalPayment.run',//UAT
    religare_agentId: '20008325', //UAT
    religare_header: {
        'appID': '554940',
        'signature': 'VLwAATi/myXGqlG9C14DVIKsLgFjEUAZIizPSIbVdJw=',
        'timestamp': '1545391069685'
    }, //UAT
    abhi_header:{
        username:'esb_bpm',
        password:'esb@bpm'
    },
    abhi_clientid:'b9794570-a8c6-4150-80a4-c0ba74e8ef46',
    abhi_client_secret:'O4eXSdzl9WelU7a6fXhFZyAlfKHWLTNwjlIw7nV0',
    abhi_grant_type:'client_credentials',
    hdfc:{
        PartnerCode:"80008037",
        UserName:"TRBHEGI",
        Password: "TRB@4621",
        premium_calc_endpoint:"https://uatcp.hdfcergo.com/ApolloOnlineCP/PremiumCaculatorHttpService.svc",
        premium_calc_soap_action:"http://www.apollomunichinsurance.com/B2BService/IPremimumCalculatorService/ComputePremium",
        proposal_create_endpoint:"https://uatcp.hdfcergo.com/ApolloOnlineCP/ProposalCaptureHttpService.svc",
        proposal_create_action:"http://www.apollomunichinsurance.com/B2BService/IProposalCaptureService/ProposalCapture",
        payment_gateway:'https://uatcp.hdfcergo.com/ApolloOnlineCP/PaymentGatewayHttpService.svc',
        payment_gateway_soap_action:'http://www.apollomunichinsurance.com/B2BService/IPaymentGatewayService/PaymentDetails',
        txn_verify:'https://uatcp.hdfcergo.com/ApolloOnlineCP/TransactionVerificationHttpService.svc',
        txn_verify_soap_action:'http://www.apollomunichinsurance.com/B2BService/ITransactionVerificationService/VerifyTransaction'
    },
    //api_endpoint:'http://128.199.165.116:3009', //DEV
    api_endpoint: 'http://65.1.41.148:3009', //UAT
    hosting_endpoint: 'http://65.1.41.148/policymall/#', //UAT
    aditya_endpoint: 'https://bizpre.adityabirlahealth.com', //'https://esbuat.adityabirlahealth.com'
    abhi_landing_page_url: 'https://pg_uat.adityabirlahealth.com/ABHI_PG_Integration/ABHISourceLanding.aspx',
    secSignature: 'd6fa30e4ee80409bb0257d493d44acf5',
    coverType: ['individual', 'family-floater'],
    IntermediaryName: 'Trinity Reinsurance Brokers Limited - Noida Branch',
    IntermediaryCode: '5100017',
    sourceCode: 'TRIN0010',
    childamaxAgelimit: 24,
    childminAge:0.25,
    bitly_endpoint:'https://api-ssl.bitly.com/v4/shorten',
    bitly_access_token:'94003542f31b2080bb801664b710d7011dc20024',
    playstore_link:'https://thepolicymall.com/#/home',
    call_us:'+91 01204874600'
};



//LIVE
// export let constant = {
//     emailvalidateregex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     mobilevalidateregex: /^\d{10}$/,
//     spacebetweenwordsregex: /^\w+(\s\w+)*$/,
//     pannumberregex: /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/,
//     onlyalphabetregex: /^[A-Za-z]+$/,
//     gstval: 18,
//     APIKEY: "19d412f0f20b4873b780505ea74a7ffb", // LIVE
//     SECRETKEY: 'e255ac481f4c4cd58001e79c3d854bfb', // LIVE
//     star_endpoint: 'https://ig.starhealth.in',//LIVE
//     star_JWT_userid: "APIKEY_LB0000000040",
//     star_JWT_password: "htmI8WzaaRbeCvMkefxFoQ==",
//     religare_endpoint: 'https://api.religarehealthinsurance.com', //LIVE
//     religare_payment_url: 'https://api.religarehealthinsurance.com/portalui/PortalPayment.run',  //LIVE
//     religare_agentId: '20219187', //LIVE
//     religare_header: {
//         'appID': '952135',
//         'signature': '+hl3GTFWLEwyqvJrL7skw1GEFm5YlC8kMmrhR0C8cK4=',
//         'timestamp': '1615895922355'
//     }, //LIVE
//     abhi_header: {
//         username: 'esb_bpm',
//         password: 'esb@bpm'
//     },
//     hdfc:{
//         PartnerCode:"80008037",
//         UserName:"TRBHEGI",
//         Password: "TRB@4621",
//         premium_calc_endpoint:"https://uatcp.hdfcergo.com/ApolloOnlineCP/PremiumCaculatorHttpService.svc",
//         premium_calc_soap_action:"http://www.apollomunichinsurance.com/B2BService/IPremimumCalculatorService/ComputePremium",
//         proposal_create_endpoint:"https://uatcp.hdfcergo.com/ApolloOnlineCP/ProposalCaptureHttpService.svc",
//         proposal_create_action:"http://www.apollomunichinsurance.com/B2BService/IProposalCaptureService/ProposalCapture",
//         payment_gateway:'https://uatcp.hdfcergo.com/ApolloOnlineCP/PaymentGatewayHttpService.svc',
//         payment_gateway_soap_action:'http://www.apollomunichinsurance.com/B2BService/IPaymentGatewayService/PaymentDetails',
//         txn_verify:'https://uatcp.hdfcergo.com/ApolloOnlineCP/TransactionVerificationHttpService.svc',
//         txn_verify_soap_action:'http://www.apollomunichinsurance.com/B2BService/ITransactionVerificationService/VerifyTransaction'
//     },
//     abhi_clientid: 'b9794570-a8c6-4150-80a4-c0ba74e8ef46',
//     abhi_client_secret: 'O4eXSdzl9WelU7a6fXhFZyAlfKHWLTNwjlIw7nV0',
//     abhi_grant_type: 'client_credentials',
//     api_endpoint: 'https://thepolicymall.com:3009', //LIVE
//     hosting_endpoint: 'https://thepolicymall.com/#', //LIVE
//     aditya_endpoint: 'https://bizpre.adityabirlahealth.com', //'https://esbuat.adityabirlahealth.com'
//     abhi_landing_page_url: 'https://pg_uat.adityabirlahealth.com/ABHI_PG_Integration/ABHISourceLanding.aspx',
//     secSignature: 'd6fa30e4ee80409bb0257d493d44acf5',
//     coverType: ['individual', 'family-floater'],
//     IntermediaryName: 'Trinity Reinsurance Brokers Limited - Noida Branch',
//     IntermediaryCode: '5100017',
//     sourceCode: 'TRIN0010',
//     childamaxAgelimit: 24,
//     childminAge: 0.25,
// };