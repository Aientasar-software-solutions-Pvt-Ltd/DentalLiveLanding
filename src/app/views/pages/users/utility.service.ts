//@ts-nocheck
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jsonschema from 'jsonschema';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

export interface AddEditData {
    section: object
    object: any;
    isEditMode: boolean;
    isUploadingData: boolean;
    isLoadingData: boolean;
    binaryFiles: Array<{ 'name': string, 'binaryData': string }>;

    //Reset form to initial state 
    resetForm()
    //To check if data exists
    hasData();
    //To load existing Data using GET
    loadData(id);
    //Function is binded whenever a file is slected using file input,this adds binary data to binary files array
    loadBinaryFile(event);
    //When form is submitted
    onSubmit();
    //Run this if binaryArray has files(optional)
    uploadBinaryData();
    //Run this if binaryArray has NO files
    uploadFormData()
}

export interface ListData {
    isLoadingData: boolean;
    objectList: any;
    pristineData: any;
    itemsPerPage: number;
    pageNumber: number
    object: any;

    //Loads all the Data using GET operation
    loadData();
    //To filter Data
    filterData(filterValue: string);
    //To Sort Data
    sortData(sortValue: string);
    //To Paginate Data
    changePage(number: number);
    //Helper fucntion
    counter(items: number)
}

@Injectable({
    providedIn: 'root'
})

export class UtilityService {

    subuserValidateURL = "https://www.dentallive.com/auth/subuservalidate/";
    // mailURL = "http://localhost:4200/subuservalidate";

    vendorValidateURL = "https://dwr5mpoypj82j.cloudfront.net/validate";
    enterpriseValidateURL = "https://d5ln7flo5uu18.cloudfront.net/validate";
    subadminValidateURL = "https://dr5ac6u1o6vn9.cloudfront.net/validate";
    locationValidateURL = "https://db50drtz1e1ys.cloudfront.net/validate";

    passwordResetURL = "https://www.dentallive.com/auth/reset";
    subpasswordResetURL = "https://www.dentallive.com/auth/subreset";
    etrValidateURL = "https://www.dentallive.com/auth/etrvalidate";
    accountValidateURL = "https://www.dentallive.com/auth/validate";

    Validator = jsonschema.Validator;
    dovValidateSchema = new this.Validator();
    constructor(private http: HttpClient) { }

    getUserDetails() {
        try {
            let user = sessionStorage.getItem("usr");
            if (!user)
                return false;
            let decrypt = JSON.parse(CryptoJS.AES.decrypt(user, environment.decryptKey).toString(CryptoJS.enc.Utf8));
            console.log(decrypt)
            if (decrypt.exp < Date.now())
                return false;
            return decrypt;
        } catch (e) {
            sessionStorage.setItem("loggedOutUser", sessionStorage.getItem("usr"))
            sessionStorage.removeItem("usr");
            return false;
        }
    }

    uploadBinaryData(objectName, binaryData, s3BucketName) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.getPreSignedUrl(objectName, s3BucketName, binaryData.type).then((url) => {
                that.saveDataS3(binaryData, url).then(() => {
                    resolve({ 'name': objectName, 'url': url });
                }).catch((e) => {
                    console.log(e);
                    reject("Failed to Upload");
                });
            }).catch((e) => {
                console.log(e);
                reject("Failed to Upload");
            });
        });
    }

    async getPreSignedUrl(objectName, s3BucketName, ext) {
        let data = { "name": objectName, 'type': 'put', 'ext': ext, "storage": s3BucketName }
        let Response = await this.http.post("https://oihqs7mi22.execute-api.us-west-2.amazonaws.com/default/createPreSignedURLSecured", JSON.stringify(data)).toPromise();
        let decrypt = CryptoJS.AES.decrypt(Response['url'], environment.decryptKey).toString(CryptoJS.enc.Utf8);
        return decrypt;
    }

    async saveDataS3(binaryData: any, url: any) {
        if (await this.http.put(url, binaryData).toPromise()) return true;
    }

    apiData = {
        // admin module
        "accounts": {
            "object": {
                "dentalId": "",
                "firstName": "",
                "lastName": "",
                "email": "",
                "dob": 0,
                "address": "",
                "userValid": false,
                "status": true,
                "dateCreated": 0,
                "dateUpdated": 0,
                "clinicName": "",
                "imageSrc": "",
                "phoneNumber": "",
                "password": ""
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "dentalId": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "dob": {
                        "type": "any"
                    },
                    "address": {
                        "type": "string"
                    },
                    "userValid": {
                        "type": "boolean"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "clinicName": {
                        "type": "string"
                    },
                    "imageSrc": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    }
                },
                "required": [
                    "firstName",
                    "lastName",
                    "email",
                    "userValid",
                    "status"
                ]
            },
            "ApiUrl": "https://l20bpfo7ob.execute-api.us-west-2.amazonaws.com/default/accounts",
        },
        "products": {
            "object": {
                "productID": "",
                "productName": "",
                "description": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true,
                "features": [],
                "dependecies": {
                    "packages": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "productID": {
                        "type": "string"
                    },
                    "productName": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "features": {
                        "type": "array",
                        "items": [{
                            "type": "object",
                            "properties": {
                                "featureName": {
                                    "type": "string"
                                },
                                "dateUpdated": {
                                    "type": "integer"
                                },
                                "description": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "featureName",
                                "dateUpdated"
                            ]
                        }]
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "packages": {
                                "type": "array",
                                "items": [{
                                    "type": "object",
                                    "properties": {
                                        "packageID": {
                                            "type": "string"
                                        },
                                        "packageName": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "packageID",
                                        "packageName"
                                    ]
                                }]
                            }
                        },
                    }
                },
                "required": [
                    "productName",
                    "status",
                    "features"
                ]
            },
            "ApiUrl": "https://ifsmnqktk4.execute-api.us-west-2.amazonaws.com/default/products",
            "bucket": 'dentallive-vendors'
        },
        "packages": {
            "object": {
                "packageID": "",
                "packageName": "",
                "description": "",
                "packagePrice": 0,
                "products": [],
                "status": true,
                "dateCreated": 0,
                "dateUpdated": 0,
                "expirationDate": 0,
                "activationDate": 0,
                "deactivationDate": 0,
                "tenure": 0,
                "usersAllocated": 0,
                "storageAllocated": 0,
                "addOnList": [],
                "dependencies": {
                    "vendors": [],
                    "purchases": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "packageID": {
                        "type": "string"
                    },
                    "packageName": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "packagePrice": {
                        "type": "float"
                    },
                    "products": {
                        "type": "array",
                        "items": {}
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dateCreated": {
                        "type": "any"
                    },
                    "dateUpdated": {
                        "type": "any"
                    },
                    "expirationDate": {
                        "type": "any"
                    },
                    "activationDate": {
                        "type": "any"
                    },
                    "deactivationDate": {
                        "type": "any"
                    },
                    "tenure": {
                        "type": "integer"
                    },
                    "usersAllocated": {
                        "type": "integer"
                    },
                    "storageAllocated": {
                        "type": "float"
                    },
                    "addOnList": {
                        "type": "array",
                        "items": [
                            {
                                "type": "object",
                                "properties": {
                                    "addonID": {
                                        "type": "string"
                                    },
                                    "addonName": {
                                        "type": "string"
                                    },
                                    "dateUpdated": {
                                        "type": "any"
                                    },
                                    "description": {
                                        "type": "string"
                                    },
                                    "parameterId": {
                                        "type": "string"
                                    },
                                    "parameterValue": {
                                        "type": "integer"
                                    },
                                    "price": {
                                        "type": "float"
                                    }
                                },
                                "required": [
                                    "addonName",
                                    "parameterId",
                                    "parameterValue",
                                    "price"
                                ]
                            }
                        ]
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "vendors": {
                                "type": "array",
                                "items": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "vendorID": {
                                                "type": "string"
                                            },
                                            "firstName": {
                                                "type": "string"
                                            },
                                            "lastName": {
                                                "type": "string"
                                            }
                                        },
                                        "required": [
                                            "vendorID"
                                        ]
                                    }
                                ]
                            },
                            "purchases": {
                                "type": "array",
                                "items": {}
                            }
                        }
                    }
                },
                "required": [
                    "packageName",
                    "packagePrice",
                    "products",
                    "status",
                    "activationDate",
                    "tenure",
                    "usersAllocated",
                    "storageAllocated"
                ]
            },
            "ApiUrl": "https://oms5sh4336.execute-api.us-west-2.amazonaws.com/default/packages",
        },
        "vendors": {
            "object": {
                "vendorID": "",
                "firstName": "",
                "lastName": "",
                "phoneNumber": 0,
                "email": "",
                "picture": "",
                "maxCommission": 0,
                "companyName": "",
                "address": "",
                "assignedPackages": [],
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true,
                "dependencies": {
                    "purchases": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "vendorID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "integer"
                    },
                    "email": {
                        "type": "string"
                    },
                    "picture": {
                        "type": "string"
                    },
                    "maxCommission": {
                        "type": "integer"
                    },
                    "companyName": {
                        "type": "string"
                    },
                    "address": {
                        "type": "string"
                    },
                    "assignedPackages": {
                        "type": "array",
                        "items": {}
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "password": {
                        "type": "string"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "purchases": {
                                "type": "array",
                                "items": {}
                            }
                        }
                    }
                },
                "required": [
                    "firstName",
                    "lastName",
                    "email",
                    "maxCommission",
                    "companyName",
                    "status"
                ]
            },
            "ApiUrl": "https://m6bmrfyko3.execute-api.us-west-2.amazonaws.com/default/vendors",
            "bucket": 'dentallive-vendors',
            "bucketUrl": "https://dentallive-vendors.s3.us-west-2.amazonaws.com/"
        },
        "adminClaims": {
            "object": {
                "claimID": "",
                "customerInvoiceId": "",
                "vendorId": "",
                "dateUpdated": 0,
                "status": true,
                "receiptNo": "",
                "receiptUpload": "",
                "paymentDate": 0,
                "amountPaid": 0,
                "paymentMode": "",
                "dependencies": {
                    "vendor": {
                        "firstName": "",
                        "lastName": "",
                        "picture": "",
                        "vendorID": ""
                    },
                    "purchases": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "claimID": {
                        "type": "string"
                    },
                    "customerInvoiceId": {
                        "type": "string"
                    },
                    "vendorId": {
                        "type": "string"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "receiptNo": {
                        "type": "string"
                    },
                    "receiptUpload": {
                        "type": "string"
                    },
                    "paymentDate": {
                        "type": "integer"
                    },
                    "amountPaid": {
                        "type": "integer"
                    },
                    "paymentMode": {
                        "type": "string"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "vendor": {
                                "type": "object",
                                "properties": {
                                    "firstName": {
                                        "type": "string"
                                    },
                                    "lastName": {
                                        "type": "string"
                                    },
                                    "picture": {
                                        "type": "string"
                                    },
                                    "vendorID": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "firstName",
                                    "lastName",
                                    "picture",
                                    "vendorID"
                                ]
                            },
                            "purchases": {
                                "type": "array",
                                "items": {}
                            }
                        }
                    }
                },
                "required": [
                    "claimID",
                    "customerInvoiceId",
                    "vendorId",
                    "status",
                    "receiptNo",
                    "paymentDate",
                    "amountPaid",
                    "paymentMode"
                ]
            },
            "ApiUrl": "https://ak619qj2m7.execute-api.us-west-2.amazonaws.com/default/claims",
        },
        "adminRoles": {
            "object": {
                "roleName": "",
                "permissionList": {},
                "roleID": "",
                "status": true,
                "dateCreated": 0,
                "dateUpdated": 0,
                "dependencies": {
                    "subadmins": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "roleName": {
                        "type": "string"
                    },
                    "permissionList": {
                        "type": "object"
                    },
                    "roleID": {
                        "type": "string"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "subadmins": {
                                "type": "array",
                                "items": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "subAdminID": {
                                                "type": "string"
                                            },
                                            "firstName": {
                                                "type": "string"
                                            },
                                            "lastName": {
                                                "type": "string"
                                            }
                                        },
                                        "required": [
                                            "subAdminID"
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                },
                "required": [
                    "roleName",
                    "permissionList",
                    "status"
                ]
            },
            "ApiUrl": "https://d8tb964zy4.execute-api.us-west-2.amazonaws.com/default/adminrole",
        },
        "subAdmin": {
            "object": {
                "subAdminID": "",
                "firstName": "",
                "lastName": "",
                "email": "",
                "photo": "",
                "roleID": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true,
                "isValid": false
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "subAdminID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "photo": {
                        "type": "string"
                    },
                    "roleID": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "password": {
                        "type": "string"
                    },
                    "isValid": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "firstName",
                    "lastName",
                    "email",
                    "roleID",
                    "status",
                    "isValid"
                ]
            },
            "ApiUrl": "https://2iqwslm56c.execute-api.us-west-2.amazonaws.com/default/subadmin",
            "bucket": 'dentallive-subadmin',
            "bucketUrl": "https://dentallive-subadmin.s3.us-west-2.amazonaws.com/"
        },
        "subAdminAccounts": {
            "object": {
                "subAdminID": "",
                "firstName": "",
                "lastName": "",
                "email": "",
                "photo": ""
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "subAdminID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "photo": {
                        "type": "string"
                    }
                },
                "required": [
                    "firstName",
                    "lastName",
                    "email"
                ]
            },
            "ApiUrl": "https://0ofb8xakij.execute-api.us-west-2.amazonaws.com/default/subadminaccounts",
            "bucket": 'dentallive-subadmin',
            "bucketUrl": "https://dentallive-subadmin.s3.us-west-2.amazonaws.com/"
        },
        "cms": {
            "object": {
                "landingPage": {},
                "faqPage": {},
                "productPage": [],
                "dateUpdated": 0
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "landingPage": {
                        "type": "object"
                    },
                    "faqPage": {
                        "type": "object"
                    },
                    "productPage": {
                        "type": "array",
                        "items": {}
                    },
                    "dateUpdated": {
                        "type": "integer"
                    }
                },
                "required": []
            },
            "ApiUrl": "https://nvkkg66ei2.execute-api.us-west-2.amazonaws.com/default/cms",
            "bucket": 'dentallive-cms',
            "bucketUrl": "https://dentallive-cms.s3.us-west-2.amazonaws.com/"
        },

        //vendor module
        "coupon": {
            "object": {
                "couponName": "",
                "discount": 0,
                "validFrom": 0,
                "validTo": 0,
                "selectPackages": [],
                "status": true,
                "dateCreated": 0,
                "dateUpdted": 0,
                "couponID": "",
                "vendorID": "",
                "freezed": false,
                "dependencies": {
                    "purchases": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "couponName": {
                        "type": "string"
                    },
                    "discount": {
                        "type": "integer"
                    },
                    "validFrom": {
                        "type": "integer"
                    },
                    "validTo": {
                        "type": "integer"
                    },
                    "selectPackages": {
                        "type": "array",
                        "items": {}
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdted": {
                        "type": "integer"
                    },
                    "couponID": {
                        "type": "string"
                    },
                    "vendorID": {
                        "type": "string"
                    },
                    "freezed": {
                        "type": "boolean"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "purchases": {
                                "type": "array",
                                "items": {}
                            }
                        }
                    }
                },
                "required": [
                    "couponName",
                    "discount",
                    "validFrom",
                    "validTo",
                    "vendorID",
                    "selectPackages",
                    "status",
                    "freezed"
                ]
            },
            "ApiUrl": "https://gwrbq7el4e.execute-api.us-west-2.amazonaws.com/default/coupons",
        },
        "vendorClaims": {
            "object": {
                "customerInvoiceId": "",
                "vendorId": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "price": 0,
                "taxDeductions": 0,
                "totalPrice": 0,
                "currency": "",
                "status": false,
                "claimID": ""
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "customerInvoiceId": {
                        "type": "string"
                    },
                    "vendorId": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "price": {
                        "type": "integer"
                    },
                    "taxDeductions": {
                        "type": "integer"
                    },
                    "totalPrice": {
                        "type": "integer"
                    },
                    "currency": {
                        "type": "string"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "claimID": {
                        "type": "string"
                    }
                },
                "required": [
                    "customerInvoiceId",
                    "vendorId",
                    "status"
                ]
            },
            "ApiUrl": "https://2rcb6zf2n3.execute-api.us-west-2.amazonaws.com/default/vendorclaims",
        },
        "vendorAccounts": {
            "object": {
                "vendorID": "",
                "firstName": "",
                "lastName": "",
                "phoneNumber": 0,
                "email": "",
                "picture": "",
                "companyName": "",
                "address": "",
                "dependencies": {
                    "purchases": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "vendorID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "integer"
                    },
                    "email": {
                        "type": "string"
                    },
                    "picture": {
                        "type": "string"
                    },
                    "companyName": {
                        "type": "string"
                    },
                    "address": {
                        "type": "string"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "purchases": {
                                "type": "array",
                                "items": {}
                            }
                        }
                    }
                },
                "required": [
                    "vendorID",
                    "firstName",
                    "lastName",
                    "email",
                    "companyName",
                ]
            },
            "ApiUrl": "https://ew5os4prcd.execute-api.us-west-2.amazonaws.com/default/vendoraccounts",
            "bucket": 'dentallive-vendors',
            "bucketUrl": "https://dentallive-vendors.s3.us-west-2.amazonaws.com/"
        },

        //user module
        "mails": {
            "ApiUrl": "https://dfgirshn9d.execute-api.us-west-2.amazonaws.com/default/sendMailDental",
            "bucket": 'dentallive-accounts',
            "bucketUrl": "https://dentallive-accounts.s3.us-west-2.amazonaws.com/",
            "fileURL": "https://www.dentallive.com/file/"
        },
        "userAccounts": {
            "object": {
                "url": this.accountValidateURL,
                "dentalId": "",
                "accountfirstName": null,
                "accountlastName": null,
                "emailAddress": null,
                "dob": 0,
                "address": "",
                "userValid": false,
                "status": true,
                "dateCreated": 0,
                "dateUpdated": 0,
                "clinicName": "",
                "imageSrc": null,
                "phoneNumber": "",
                "forwards": [],
                "education": "",
                "country": "",
                "city": "",
                "speciality": "",
                "primaryPractice": ""
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string"
                    },
                    "dentalId": {
                        "type": "string"
                    },
                    "accountfirstName": {
                        "type": "string"
                    },
                    "accountlastName": {
                        "type": "string"
                    },
                    "emailAddress": {
                        "type": "string"
                    },
                    "dob": {
                        "type": "any"
                    },
                    "address": {
                        "type": "string"
                    },
                    "userValid": {
                        "type": "boolean"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "clinicName": {
                        "type": "string"
                    },
                    "speciality": {
                        "type": "string"
                    },
                    "imageSrc": {
                        "type": "any"
                    },
                    "phoneNumber": {
                        "type": "string"
                    },
                    "forwards": {
                        "type": "array"
                    },
                    "education": {
                        "type": "string"
                    },
                    "country": {
                        "type": "string"
                    },
                    "city": {
                        "type": "string"
                    },
                    "primaryPractice": {
                        "type": "string"
                    },
                },
                "required": [
                    "accountfirstName",
                    "accountlastName",
                    "emailAddress"
                ]
            },
            "ApiUrl": "https://4knzuow8v7.execute-api.us-west-2.amazonaws.com/default/useraccounts",
            "bucket": 'dentallive-accounts',
            "bucketUrl": "https://dentallive-accounts.s3.us-west-2.amazonaws.com/",
            "subBucket": 'dentallive-subusers',
            "subBucketUrl": "https://dentallive-subusers.s3.us-west-2.amazonaws.com/",
        },
        "userRoles": {
            "object": {
                "dentalID": null,
                "roleID": "",
                "roleName": null,
                "permissionList": [],
                "status": true,
                "dateCreated": 0,
                "dateUpdated": 0,
                "dependencies": {
                    "subusers": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "dentalID": {
                        "type": "string"
                    },
                    "roleID": {
                        "type": "string"
                    },
                    "roleName": {
                        "type": "string"
                    },
                    "permissionList": {
                        "type": "array"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "subusers": {
                                "type": "array",
                            }
                        },
                    }
                },
                "required": [
                    "dentalID",
                    "roleName",
                    "permissionList",
                    "status"
                ]
            },
            "ApiUrl": "https://fpslvoaahl.execute-api.us-west-2.amazonaws.com/default/customerroles",
        },
        "subUser": {
            "object": {
                "url": this.subuserValidateURL,
                "dentalID": null,
                "subUserID": "",
                "firstName": null,
                "lastName": null,
                "email": null,
                "imageSrc": "",
                "roleID": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true,
                "isValid": false,
                "packageID": null,
                "practiceId": [],
                "dependencies": {
                    "mails": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string"
                    },
                    "dentalID": {
                        "type": "string"
                    },
                    "subUserID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "photo": {
                        "type": "string"
                    },
                    "roleID": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "password": {
                        "type": "string"
                    },
                    "isValid": {
                        "type": "boolean"
                    },
                    "packageID": {
                        "type": "string"
                    },
                    "practiceId": {
                        "type": "array"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "mails": {
                                "type": "array",
                            }
                        },
                    }
                },
                "required": [
                    "dentalID",
                    "firstName",
                    "lastName",
                    "email",
                    "roleID",
                    "status",
                    "isValid",
                    "packageID"
                ]
            },
            "ApiUrl": "https://5gw8on6fxc.execute-api.us-west-2.amazonaws.com/default/subusernew",
            "bucket": 'dentallive-subusers',
            "bucketUrl": "https://dentallive-subusers.s3.us-west-2.amazonaws.com/"
        },
        "subUserAccounts": {
            "object": {
                "dentalID": null,
                "subUserID": "",
                "firstName": null,
                "lastName": null,
                "email": null,
                "imageSrc": "",
                "roleID": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true,
                "isValid": false,
                "packageID": null,
                "permission": []
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string"
                    },
                    "dentalID": {
                        "type": "string"
                    },
                    "subUserID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "photo": {
                        "type": "string"
                    },
                    "roleID": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "password": {
                        "type": "string"
                    },
                    "isValid": {
                        "type": "boolean"
                    },
                    "packageID": {
                        "type": "string"
                    },
                    "permission": {
                        "type": "array"
                    }
                },
                "required": [
                    "dentalID",
                    "firstName",
                    "lastName",
                    "email",
                    "packageID"
                ]
            },
            "ApiUrl": "https://3lylunfpg9.execute-api.us-west-2.amazonaws.com/default/subuseraccountsnew",
            "bucket": 'dentallive-subusers',
            "bucketUrl": "https://dentallive-subusers.s3.us-west-2.amazonaws.com/"
        },
        "purchases": {
            "object": {
                "payPal": {},
                "customerInvoiceId": "",
                "email": "",
                "accountID": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "packageID": "",
                "modeOfPayment": "Paypal",
                "isAddOn": false,
                "addOnId": "",
                "actualPrice": 0,
                "price": 0,
                "taxPrice": 0,
                "totalPrice": 0,
                "currency": "USD",
                "couponCode": "",
                "couponID": "",
                "isRenewal": false,
                "renewalDate": 0,
                "vendorID": "",
                "dependencies": {
                    "package": {},
                    "vendor": {},
                    "user": {},
                    "coupon": {}
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "payPal": {
                        "type": "object"
                    },
                    "customerInvoiceId": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "accountID": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "packageID": {
                        "type": "string"
                    },
                    "modeOfPayment": {
                        "type": "string"
                    },
                    "isAddOn": {
                        "type": "boolean"
                    },
                    "addOnId": {
                        "type": "string"
                    },
                    "actualPrice": {
                        "type": "integer"
                    },
                    "price": {
                        "type": "integer"
                    },
                    "taxPrice": {
                        "type": "integer"
                    },
                    "totalPrice": {
                        "type": "integer"
                    },
                    "currency": {
                        "type": "string"
                    },
                    "couponCode": {
                        "type": "string"
                    },
                    "couponID": {
                        "type": "string"
                    },
                    "isRenewal": {
                        "type": "boolean"
                    },
                    "renewalDate": {
                        "type": "integer"
                    },
                    "vendorID": {
                        "type": "string"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "package": {
                                "type": "object"
                            },
                            "vendor": {
                                "type": "object",
                                "properties": {
                                    "vendorID": {
                                        "type": "string"
                                    },
                                    "firstName": {
                                        "type": "string"
                                    },
                                    "lastName": {
                                        "type": "string"
                                    },
                                    "picture": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "vendorID",
                                    "firstName",
                                    "lastName",
                                    "picture"
                                ]
                            },
                            "user": {
                                "type": "object"
                            },
                            "coupon": {
                                "type": "object"
                            }
                        },
                    }
                },
                "required": [
                    "payPal",
                    "email",
                    "accountID",
                    "packageID",
                    "modeOfPayment",
                    "isAddOn",
                    "currency",
                    "couponCode",
                    "couponID",
                    "isRenewal"
                ]
            },
            "ApiUrl": "https://fsiyqdwc8j.execute-api.us-west-2.amazonaws.com/default/purchases",
            "bucket": 'dentallive-accounts',
            "bucketUrl": "https://dentallive-accounts.s3.us-west-2.amazonaws.com/"
        },
        "userPurchases": {
            "object": {
                "payPal": {},
                "customerInvoiceId": "",
                "email": "",
                "accountID": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "packageID": "",
                "modeOfPayment": "Paypal",
                "isAddOn": false,
                "addOnId": "",
                "actualPrice": 0,
                "price": 0,
                "taxPrice": 0,
                "totalPrice": 0,
                "currency": "USD",
                "couponCode": "",
                "couponID": "",
                "isRenewal": false,
                "renewalDate": 0,
                "vendorID": "",
                "dependencies": {
                    "package": {},
                    "vendor": {},
                    "user": {},
                    "coupon": {}
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "payPal": {
                        "type": "object"
                    },
                    "customerInvoiceId": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "accountID": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "packageID": {
                        "type": "string"
                    },
                    "modeOfPayment": {
                        "type": "string"
                    },
                    "isAddOn": {
                        "type": "boolean"
                    },
                    "addOnId": {
                        "type": "string"
                    },
                    "actualPrice": {
                        "type": "integer"
                    },
                    "price": {
                        "type": "integer"
                    },
                    "taxPrice": {
                        "type": "integer"
                    },
                    "totalPrice": {
                        "type": "integer"
                    },
                    "currency": {
                        "type": "string"
                    },
                    "couponCode": {
                        "type": "string"
                    },
                    "couponID": {
                        "type": "string"
                    },
                    "isRenewal": {
                        "type": "boolean"
                    },
                    "renewalDate": {
                        "type": "integer"
                    },
                    "vendorID": {
                        "type": "string"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "package": {
                                "type": "object"
                            },
                            "vendor": {
                                "type": "object",
                                "properties": {
                                    "vendorID": {
                                        "type": "string"
                                    },
                                    "firstName": {
                                        "type": "string"
                                    },
                                    "lastName": {
                                        "type": "string"
                                    },
                                    "picture": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "vendorID",
                                    "firstName",
                                    "lastName",
                                    "picture"
                                ]
                            },
                            "user": {
                                "type": "object"
                            },
                            "coupon": {
                                "type": "object"
                            }
                        },
                    }
                },
                "required": [
                    "payPal",
                    "email",
                    "accountID",
                    "packageID",
                    "modeOfPayment",
                    "isAddOn",
                    "currency",
                    "couponCode",
                    "couponID",
                    "isRenewal"
                ]
            },
            "ApiUrl": "https://chvuidsbp0.execute-api.us-west-2.amazonaws.com/default/userpurchases",
        },
        "usage": {
            "ApiUrl": "https://89vx1esx7k.execute-api.us-west-2.amazonaws.com/default/usage",
        },
        "patients": {
            "object": {
                "dentalID": null,
                "patientID": "",
                "firstName": null,
                "lastName": null,
                "dob": null,
                "phoneNumber": null,
                "email": null,
                "imageSrc": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true,
                "dependencies": {
                    "mails": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "dentalID": {
                        "type": "string"
                    },
                    "patientID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "imageSrc": {
                        "type": "string"
                    },
                    "dob": {
                        "type": "any"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "mails": {
                                "type": "array",
                            }
                        },
                    }
                },
                "required": [
                    "dentalID",
                    "firstName",
                    "lastName",
                    "email"
                ]
            },
            "ApiUrl": "https://orsjgboa04.execute-api.us-west-2.amazonaws.com/default/patients",
            "bucket": 'dentallive-patients',
            "bucketUrl": "https://dentallive-patients.s3.us-west-2.amazonaws.com/"
        },
        "contacts": {
            "object": {
                "dentalID": null,
                "contactID": "",
                "firstName": null,
                "lastName": null,
                "phoneNumber": "",
                "email": null,
                "imageSrc": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true,
                "dependencies": {
                    "mails": []
                }
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "dentalID": {
                        "type": "string"
                    },
                    "contactID": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "imageSrc": {
                        "type": "string"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "status": {
                        "type": "boolean"
                    },

                    "dependencies": {
                        "type": "object",
                        "properties": {
                            "mails": {
                                "type": "array",
                            }
                        },
                    }

                },
                "required": [
                    "dentalID",
                    "firstName",
                    "lastName",
                    "email"
                ]
            },
            "ApiUrl": "https://t5n1o1jbxj.execute-api.us-west-2.amazonaws.com/default/contacts",
            "bucket": 'dentallive-contacts',
            "bucketUrl": "https://dentallive-contacts.s3.us-west-2.amazonaws.com/"
        },
        "meetAccount": {
            "dentalID": null,
            "meetMail": null,
            "extension": null,
            "status": true
        },
        "meetMeeting": {
            "object": {
                "dentalID": null,
                "meetingID": "",
                "3CXMeetingID": null,
                "title": null,
                "description": null,
                "startTime": 0,
                "endTime": 0,
                "hostURL": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "isCompleted": false,
                "isCancelled": false,
                "participants": [],
            },
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "dentalID": {
                    "type": "string"
                },
                "meetingID": {
                    "type": "string"
                },
                "3CXMeetingID": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "startTime": {
                    "type": "integer"
                },
                "endTime": {
                    "type": "integer"
                },
                "hostURL": {
                    "type": "string"
                },
                "dateCreated": {
                    "type": "integer"
                },
                "dateUpdated": {
                    "type": "integer"
                },
                "isCompleted": {
                    "type": "boolean"
                },
                "isCancelled": {
                    "type": "boolean"
                },
                "participants": {
                    "type": "array",
                    "items": {}
                }
            },
            "required": [
                "dentalID",
                "meetingID",
                "title",
                "startTime",
                "hostURL"
            ]
        },
        "userPatients": {
            "object": {
                "dentalID": null,
                "patientID": "",
                "firstName": null,
                "lastName": null,
                "dob": null,
                "phoneNumber": null,
                "email": null,
                "image": "",
                "dateCreated": 0,
                "dateUpdated": 0,
                "status": true
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "refId": {
                        "type": "string"
                    },
                    "image": {
                        "type": "string"
                    },
                    "gender": {
                        "type": "integer"
                    },
                    "dob": {
                        "type": "integer"
                    },
                    "email": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "address": {
                        "type": "object"
                    },
                    "city": {
                        "type": "string"
                    },
                    "residingState": {
                        "type": "string"
                    },
                    "notes": {
                        "type": "object"
                    },
                    "insurance": {
                        "type": "object"
                    },
                    "medication": {
                        "type": "object"
                    }
                },
                "required": [
                    "firstName",
                    "lastName",
                    "dob",
                    "email",
                    "residingState"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/patients",
            "bucket": 'dentallive-patients',
            "bucketUrl": "https://dentallive-patients.s3.us-west-2.amazonaws.com/"
        },
        "userCases": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "image": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "description": {
                        "type": "object"
                    },
                    "caseStatus": {
                        "type": "boolean"
                    },
                    "caseType": {
                        "type": "array",
                        "items": "{}"
                    }
                },
                "required": [
                    "patientId",
                    "patientName",
                    "title",
                    "description",
                    "caseType",
                    "caseStatus"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/cases",
            "bucket": 'dentallive-cases',
            "bucketUrl": "https://dentallive-cases.s3.us-west-2.amazonaws.com/"
        },
        "userCaseFiles": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "fileUploadId": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "files": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "url": {
                                    "type": "string"
                                },
                                "name": {
                                    "type": "string"
                                },
                                "mediaType": {
                                    "type": "string"
                                },
                                "mediaSize": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "url",
                                "name"
                            ]
                        }
                    },
                    "ownerName": {
                        "type": "string"
                    }
                },
                "required": [
                    "caseId",
                    "files",
                    "patientId",
                    "patientName"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/casefiles",
            "bucket": 'dentallive-casefiles',
            "bucketUrl": "https://dentallive-casefiles.s3.us-west-2.amazonaws.com/"
        },
        "userMilestones": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "taskId": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "startdate": {
                        "type": "integer"
                    },
                    "duedate": {
                        "type": "integer"
                    },
                    "presentStatus": {
                        "type": "integer"
                    },
                    "reminder": {
                        "type": "integer"
                    },
                    "milestoneId": {
                        "type": "string"
                    }
                },
                "required": [
                    "caseId",
                    "patientId",
                    "patientName",
                    "title",
                    "description",
                    "startdate",
                    "duedate",
                    "presentStatus",
                    "reminder"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/milestones",
            "bucket": 'dentallive-milestones',
            "bucketUrl": "https://dentallive-milestones.s3.us-west-2.amazonaws.com/"
        },
        "userTasks": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "taskId": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "startdate": {
                        "type": "integer"
                    },
                    "duedate": {
                        "type": "integer"
                    },
                    "presentStatus": {
                        "type": "integer"
                    },
                    "reminder": {
                        "type": "integer"
                    },
                    "milestoneId": {
                        "type": "string"
                    },
                    "memberMail": {
                        "type": "string"
                    },
                    "memberName": {
                        "type": "string"
                    }
                },
                "required": [
                    "caseId",
                    "patientId",
                    "patientName",
                    "title",
                    "description",
                    "startdate",
                    "duedate",
                    "presentStatus",
                    "reminder",
                    "milestoneId",
                    "memberMail",
                    "memberName"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/tasks",
            "bucket": 'dentallive-casefiles',
            "bucketUrl": "https://dentallive-casefiles.s3.us-west-2.amazonaws.com/"
        },
        "userWorkOrders": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "workorderId": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "notes": {
                        "type": "string"
                    },
                    "startdate": {
                        "type": "integer"
                    },
                    "enddate": {
                        "type": "integer"
                    },
                    "toothguide": {
                        "type": "object"
                    },
                    "milestoneId": {
                        "type": "string"
                    },
                    "presentStatus": {
                        "type": "integer"
                    }
                },
                "required": [
                    "caseId",
                    "patientId",
                    "title",
                    "toothguide",
                    "presentStatus"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/workorders",
            "bucket": 'dentallive-workorders',
            "bucketUrl": "https://dentallive-workorders.s3.us-west-2.amazonaws.com/"
        },
        "userReferrals": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "referralId": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "notes": {
                        "type": "object"
                    },
                    "startdate": {
                        "type": "integer"
                    },
                    "enddate": {
                        "type": "integer"
                    },
                    "toothguide": {
                        "type": "object"
                    },
                    "milestoneId": {
                        "type": "string"
                    },
                    "presentStatus": {
                        "type": "integer"
                    }
                },
                "required": [
                    "caseId",
                    "patientId",
                    "title",
                    "toothguide",
                    "presentStatus"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/referrals",
            "bucket": 'dentallive-referrals',
            "bucketUrl": "https://dentallive-referrals.s3.us-west-2.amazonaws.com/"
        },
        "userMessage": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "messageId": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "message": {
                        "type": "object"
                    },
                    "comments": {
                        "type": "array"
                    },
                    "messageType": {
                        "type": "integer"
                    },
                    "messageReferenceId": {
                        "type": "string"
                    }
                },
                "required": [
                    "caseId",
                    "patientId",
                    "patientName",
                    "message",
                    "messageType",
                    "messageReferenceId"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/messages",
            "bucket": 'dentallive-messages',
            "bucketUrl": "https://dentallive-messages.s3.us-west-2.amazonaws.com/"
        },
        "userColleague": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string"
                    },
                    "dentalId": {
                        "type": "string"
                    },
                    "accountfirstName": {
                        "type": "string"
                    },
                    "accountlastName": {
                        "type": "string"
                    },
                    "emailAddress": {
                        "type": "string"
                    },
                    "dob": {
                        "type": "any"
                    },
                    "address": {
                        "type": "string"
                    },
                    "userValid": {
                        "type": "boolean"
                    },
                    "status": {
                        "type": "boolean"
                    },
                    "dateCreated": {
                        "type": "integer"
                    },
                    "dateUpdated": {
                        "type": "integer"
                    },
                    "clinicName": {
                        "type": "string"
                    },
                    "imageSrc": {
                        "type": "any"
                    },
                    "phoneNumber": {
                        "type": "string"
                    },
                    "forwards": {
                        "type": "array"
                    }
                },
                "required": [
                    "accountfirstName",
                    "accountlastName",
                    "emailAddress"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/users",
            "bucket": 'dentallive-users',
            "bucketUrl": "https://dentallive-users.s3.us-west-2.amazonaws.com/"
        },
        "userCaseInvites": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "invitationId": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "invitedUserMail": {
                        "type": "string"
                    },
                    "invitedUserId": {
                        "type": "string"
                    },
                    "presentStatus": {
                        "type": "integer"
                    },
                    "invitationText": {
                        "type": "object"
                    },
                    "reponseText": {
                        "type": "object"
                    }
                },
                "required": [
                    "caseId",
                    "patientId",
                    "patientName",
                    "invitedUserMail",
                    "invitedUserId",
                    "presentStatus"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/caseinvites",
            "bucket": 'dentallive-caseinvites',
            "bucketUrl": "https://dentallive-users.s3.us-west-2.amazonaws.com/"
        },
        "userThreads": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "patientId": {
                        "type": "string"
                    },
                    "patientName": {
                        "type": "string"
                    },
                    "caseId": {
                        "type": "string"
                    }
                },
                "required": [
                    "caseId",
                    "patientId",
                    "patientName"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/threads",
            "bucket": 'dentallive-threads',
            "bucketUrl": "https://dentallive-users.s3.us-west-2.amazonaws.com/"
        },
        "userLogin": {
            "schema": {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "resourceOwner": {
                        "type": "string"
                    },
                    "dentalId": {
                        "type": "string"
                    },
                    "emailAddress": {
                        "type": "string"
                    },
                    "lastLoggedIn": {
                        "type": "integer"
                    },
                    "lastLoggedOut": {
                        "type": "integer"
                    }
                },
                "required": [
                    "dentalId",
                    "emailAddress"
                ]
            },
            "ApiUrl": "https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/login",
            "bucket": 'login',
            "bucketUrl": "https://dentallive-users.s3.us-west-2.amazonaws.com/"
        }
    }
}