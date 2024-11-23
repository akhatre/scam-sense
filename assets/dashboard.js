import React, {useContext, useEffect, useState, createContext, useRef} from 'react';
import ReactDOM from "react-dom/client";
import {VendorCatalogueApi, Configuration} from '../../../openapi';
import Cookies from 'js-cookie';

import '../../scss/app_vendor_catalogue/index.scss';
import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, useNavigate} from 'react-router-dom';

import {VendorStatusView} from "./vendor_ui"
import {SearchBar, AdvancedSearch} from "./search_ui";
import {SKUView, sortValueMap} from "./main_sku_view";

const apiUrl = process.env.API_URL;

export const SearchContext = createContext();
const root = ReactDOM.createRoot(document.getElementById('root'));
const apiClient = new VendorCatalogueApi(new Configuration({
    basePath: apiUrl,
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
    }
}));

export const getSKUKey = (SKU) => {
    return (SKU.vendor + SKU.description + SKU.name + SKU.price + SKU.manufacturer_id)
}

const VendorCatalogue = function (props) {
    // State variable to show whether we're loading data or not.
    // Defaults to "true" to show a loading screen until we get our data from the API
    const [isLoading, setIsLoading] = useState(true);
    const [SKUs, setSKUs] = useState([]);
    const [SKUViewPage, setSKUViewPage] = useState(1);

    const [searchFreeText, setSearchFreeText] = useState("");
    const [searchMaxPrice, setSearchMaxPrice] = useState("");
    const [searchMinPrice, setSearchMinPrice] = useState("");
    const [searchMinQuantity, setSearchMinQuantity] = useState("");
    const [searchManufacturerID, setSearchManufacturerID] = useState("");
    const [searchVendor, setSearchVendor] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchDescription, setSearchDescription] = useState("");
    const [searchBrand, setSearchBrand] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [searchSortBy, setSearchSortBy] = useState("");
    const [SKUViewMeta, setSKUViewMeta] = useState({});

    const [Vendors, setVendors] = useState([]);

    const navigate = useNavigate();

    const client = props.client;

    const [allVendorsHaveSuccessfulStatus, setAllVendorsHaveSuccessfulStatus] = useState(false);

    const [userPreferences, setUserPreferences] = useState(() => {
        const savedPreferences = localStorage.getItem('userPreferences');
        return savedPreferences ? JSON.parse(savedPreferences) : {theme: 'light', language: 'en'};
    });

    const [userCart, setUserCart] = useState(() => {
        const savedCart = localStorage.getItem('userCart');
        const _array = savedCart ? JSON.parse(savedCart) : [];
        return new Map(_array)
    });

    useEffect(() => {
        localStorage.setItem('userCart', JSON.stringify(Array.from(userCart.entries())));
    }, [userCart]);


    const resetUserCart = () => {
        setUserCart(new Map())
    }

    const updateCart = (SKU, modified_quantity) => {
        const SKU_key = getSKUKey(SKU);
        if (modified_quantity > 0) {
            setUserCart(userCart => {
                const updatedUserCart = new Map(userCart);
                updatedUserCart.set(SKU_key, {"quantity": modified_quantity, "SKU": SKU});
                return updatedUserCart;
            })
        } else {
            setUserCart(userCart => {
                const updatedUserCart = new Map(userCart);
                updatedUserCart.delete(SKU_key);
                return updatedUserCart;
            })
        }
    }


    const fetchVendors = () => {
        client.vendorCatalogueVendorGetVendorInfoList().then((result) => {
            setVendors(result);
            const hasExpectedLength = result.length === 10
            const allStatusSuccessful = Object.values(result).every(i => i.overall_status === 'FRESH' || i.overall_status === 'SLIGHTLY_OLD');
            if (hasExpectedLength && allStatusSuccessful) {
                setAllVendorsHaveSuccessfulStatus(true)
            }
        })
    }

    useEffect(
        () => {
            fetchVendors()
        },
        []
    )

    const fetchSKUs = (freeText, maxPrice,
                       minPrice,
                       minQuantity,
                       manufacturerID,
                       vendor,
                       sort_by,
                       name,
                       description,
                       brand,
                       category,

                       page) => {
        setIsLoading(true);
        client.vendorCatalogueSkuSearchRetrieve({
            freeText: freeText || '',
            maxPrice: maxPrice || '',
            minPrice: minPrice || '',
            minQuantity: minQuantity || '',
            manufacturerId: manufacturerID || '',
            vendor: vendor || '',
            name: name || '',
            description: description || '',
            brand: brand || '',
            category: category || '',
            page: page,
            sortBy: sort_by || '',
        }).then((result) => {
            setSKUViewMeta(result.meta)
            setSKUs(result.data);
            setIsLoading(false);

            const params = new URLSearchParams(window.location.search);
            params.set('freeText', freeText)
            params.set('maxPrice', maxPrice)
            params.set('minPrice', minPrice)
            params.set('minQuantity', minQuantity)
            params.set('manufacturerID', manufacturerID)
            params.set('vendor', vendor)
            params.set('name', name)
            params.set('description', description)
            params.set('brand', brand)
            params.set('category', category)
            params.set('page', page)
            params.set('sort_by', sort_by)
            navigate({search: params.toString()}, {replace: true});
        }).catch((e) => {
            console.error('SOMETHING WENT BAD WITH FETCHING SKUs', e)
        });
    }

    const setParamsFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        setSearchFreeText(params.get('freeText') || "");
        setSearchMaxPrice(params.get('maxPrice') || "");
        setSearchMinPrice(params.get('minPrice') || "");
        setSearchMinQuantity(params.get('minQuantity') || "");
        setSearchManufacturerID(params.get('manufacturerID') || "");
        setSearchVendor(params.get('vendor') || "");
        setSearchName(params.get('name') || "");
        setSearchDescription(params.get('description') || "");
        setSearchBrand(params.get('brand') || "");
        setSearchCategory(params.get('category') || "");
        setSKUViewPage(parseInt(params.get('page') || "1"));
        setSearchSortBy(params.get('sort_by') || "");
        setSortDropDownValue(sortValueMap[params.get('sort_by')]);
    }

    useEffect(() => {
        setParamsFromURL()
    }, []);

    useEffect(
        () => {
            fetchSKUs(searchFreeText,
                searchMaxPrice,
                searchMinPrice,
                searchMinQuantity,
                searchManufacturerID,
                searchVendor,
                searchSortBy,
                searchName,
                searchDescription,
                searchBrand,
                searchCategory,
                SKUViewPage)
        },
        [searchFreeText,
            searchMaxPrice,
            searchMinPrice,
            searchMinQuantity,
            searchManufacturerID,
            searchVendor,
            searchSortBy,
            searchName,
            searchDescription,
            searchBrand,
            searchCategory,
            SKUViewPage]
        ,
    );

    const [sortDropDownValue, setSortDropDownValue] = useState("Recommended");

    const renderTableIfReady = () => {
        if (isLoading) {
            return ("Loading...")
        } else {
            if (SKUs.length > 0) {
                return (<SKUView SKUs={SKUs}/>)
            } else {
                return ("No SKUs found!")
            }
        }
    }

    return (
        <div>
            {/* Navigation Bar */}
            <SearchContext.Provider
                value={{
                    searchFreeText, setSearchFreeText,
                    searchMaxPrice, setSearchMaxPrice,
                    searchMinPrice, setSearchMinPrice,
                    searchMinQuantity, setSearchMinQuantity,
                    searchManufacturerID, setSearchManufacturerID,
                    searchVendor, setSearchVendor,
                    SKUViewPage, setSKUViewPage,
                    searchSortBy, setSearchSortBy,
                    Vendors, SKUViewMeta,
                    userCart, updateCart,
                    resetUserCart,
                    sortDropDownValue, setSortDropDownValue,
                    searchName, setSearchName,
                    searchDescription, setSearchDescription,
                    searchBrand, setSearchBrand,
                    searchCategory, setSearchCategory,
                    fetchSKUs
                }}>

                <Container fluid="fluid" className="mt-3">
                    <Container fluid="fluid" className="mx-1">
                        <Navbar bg="light" variant="light" expand="lg">
                            <Navbar.Brand href="" onClick={() => {
                                navigate("", {replace: true});
                                setParamsFromURL()
                            }}>
                                <img src="/static/images/Forward_L_logo.png" width="30" height="30"
                                     className="d-inline-block align-top forward-l-logo" alt=""/>
                                Vendor Catalogue
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                            <Navbar.Collapse id="basic-navbar-nav">
                                <div className="mr-2 w-100">
                                    {/* Search Bar */}
                                    <SearchBar/>
                                </div>
                            </Navbar.Collapse>

                        </Navbar>


                        <Container fluid="fluid" className="d-flex flex-wrap p-0 m-0">
                            {/* Filter Settings */}
                            <button className="btn btn-outline-primary" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseExample" aria-expanded="false"
                                    aria-controls="collapseExample">
                                Advanced Search
                            </button>

                            {/* Vendor Status */}
                            <button
                                className={!isLoading ? (allVendorsHaveSuccessfulStatus ? "btn btn-success ms-2" : "btn btn-danger ms-2") : "btn btn-secondary ms-2"}
                                type="button" data-bs-toggle="collapse"
                                data-bs-target="#vendorStatusUI" aria-expanded="false"
                                aria-controls="vendorStatusUI">
                                {!isLoading ? (allVendorsHaveSuccessfulStatus ? "Vendor Status (OK)" : "Vendor Status (ERRORS)") : "Vendor Status (LOADING)"}
                            </button>

                        </Container>
                        <AdvancedSearch/>
                        {!isLoading ?
                            <VendorStatusView allVendorsHaveSuccessfulStatus={allVendorsHaveSuccessfulStatus}/> : ""}
                    </Container>

                    {/*Main Content Area*/}
                    <Container fluid="fluid" className="mx-1 mt-5">
                        <Row>
                            <Col>
                                {
                                    renderTableIfReady()
                                }
                            </Col>
                        </Row>
                    </Container>
                </Container>

            </SearchContext.Provider>
        </div>
    )
}


root.render(
    <BrowserRouter>
        <VendorCatalogue client={apiClient}/>,
    </BrowserRouter>
);


