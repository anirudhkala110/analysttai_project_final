import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Button from 'react-bootstrap/Button';
import Details from './Details';

const Homepage = () => {
    const [userdata, setUserdata] = useState([]);
    const [address, setAddress] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [msg, setMsg] = useState(null);

    const USER_API_URL = 'http://localhost:8096/api/users';
    useEffect(() => {
        axios.get(USER_API_URL)
            .then(res => {
                setUserdata(res.data);
                setAddress(res.data.address);
                const defaultItemsPerPage = 3;
                const dataSize = res.data.length;
                const calculatedItemsPerPage = dataSize > defaultItemsPerPage ? defaultItemsPerPage : dataSize;
                setItemsPerPage(calculatedItemsPerPage);
            })
            .catch(err => {
                console.log(err);
                axios.get('https://jsonplaceholder.typicode.com/users')
                    .then(res => {
                        console.log('LocalHost is not working right now. . .')
                        setUserdata(res.data);
                        setAddress(res.data.address);
                        const defaultItemsPerPage = 3;
                        const dataSize = res.data.length;
                        const calculatedItemsPerPage = dataSize > defaultItemsPerPage ? defaultItemsPerPage : dataSize;
                        setItemsPerPage(calculatedItemsPerPage);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
    }, []);

    const [modalShow, setModalShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [changeColor, setChangecolor] = useState(null);

    // Function to show the modal for a specific user
    const handleShowModal = (user) => {
        setSelectedUser(user);
        setChangecolor(user.id);
        setModalShow(true);
    };

    const handleMissingData = (data) => {
        return data ? data : 'N/A';
    };

    const pageCount = Math.ceil(userdata.length / itemsPerPage);

    const changePage = ({ selected }) => {
        setCurrentPage(selected);
    };
    // console.log(userdata)
    const offset = currentPage * itemsPerPage;
    const currentPageData = userdata.slice(offset, offset + itemsPerPage);
    const filterUsers = (searchText) => {
        if (searchText.trim() === "") {
            setFilteredUsers([]);
            setMsg("No Data Found on search");
        } else {
            const filtered = userdata.filter((user) => {
                const username = (user.username).toLowerCase();
                const name = (user.name || '').toLowerCase();
                const description = (user.description || '').toLowerCase();
                const email = (user.email || '').toLowerCase();
                const phone = (user.phone || '').toLowerCase();
                const city = (user.address.city || '').toLowerCase();
                const state = (user.address.state || '').toLowerCase();
                const zipcode = (user.address.zipcode || '').toLowerCase();
                const street = (user.address.street || '').toLowerCase();
                const suite = (user.address.suite || '').toLowerCase();
                const country = (user.address.country || '').toLowerCase();
                const companyName = (user.company ? (user.company.name || '').toLowerCase() : '');
                const catchPhrase = (user.company ? (user.company.catchPhrase || '').toLowerCase() : '');
                const bs = (user.company ? (user.company.bs || '').toLowerCase() : '');
                const lat = (user.address.geo ? (user.address.geo.lat || '').toLowerCase() : '');
                const lng = (user.address.geo ? (user.address.geo.lng || '').toLowerCase() : '');

                return (
                    username.includes(searchText.toLowerCase()) ||
                    name.includes(searchText.toLowerCase()) ||
                    description.includes(searchText.toLowerCase()) ||
                    email.includes(searchText.toLowerCase()) ||
                    phone.includes(searchText.toLowerCase()) ||
                    city.includes(searchText.toLowerCase()) ||
                    state.includes(searchText.toLowerCase()) ||
                    zipcode.includes(searchText.toLowerCase()) ||
                    street.includes(searchText.toLowerCase()) ||
                    suite.includes(searchText.toLowerCase()) ||
                    country.includes(searchText.toLowerCase()) ||
                    companyName.includes(searchText.toLowerCase()) ||
                    catchPhrase.includes(searchText.toLowerCase()) ||
                    bs.includes(searchText.toLowerCase()) ||
                    lat.includes(searchText.toLowerCase()) ||
                    lng.includes(searchText.toLowerCase())
                );
            });

            if (filtered.length > 0) {
                setFilteredUsers(filtered);
                setMsg(null); // Clear any previous "No Data Found" message
            } else {
                setFilteredUsers([]);
                setMsg("No Data Found on search");
            }
        }
    };


    const handleFilterInputChange = (e) => {
        setSearchText(e.target.value);
        filterUsers(e.target.value);
    };

    return (
        <div className='min-vh-100' style={{ background: "rgb(243 246 251)" }}>
            <div className="search-bar w-100 px-4">
                <input
                    type="text"
                    className='form-control w-100'
                    placeholder="Search any keyword..."
                    value={searchText}
                    onChange={handleFilterInputChange}
                />
            </div>
            <div className='pt-4' style={{ background: "rgb(243 246 251)" }}>
                {filteredUsers.length > 0
                    ? filteredUsers.map((dataItem, index) => (
                        <div className="bg-light mb-2 mx-3 px-3" onClick={() => handleShowModal(dataItem)} key={index}>
                            <button className='card p-2 w-100 text-start'>
                                <div>
                                    <div className='fw-bold'>{handleMissingData(dataItem.username)}</div>
                                </div>
                                <hr className='' style={{ color: "black" }} />
                                <div>
                                    <div className='fw-bold'>CONTACT</div>
                                    <div> {handleMissingData(dataItem.name)}</div>
                                </div>
                            </button>
                        </div>
                    ))
                    :
                    <div>
                        {msg && <div className='mx-3 mb-4 d-flex align-items-center'>
                            {msg} <button className='btn fs-3' onClick={e => setMsg(null)}>&times;</button>
                        </div>}
                    </div>
                }
                {
                    filteredUsers.length <= 0 ? <>{userdata ? currentPageData.map((dataItem, index) => (
                        <div key={index} className={`text-decoration-none`} style={{ cursor: "pointer" }}>
                            <div className={`min-width-740 border py-5 px-3 mx-2 rounded rounded-4 mb-2 ${changeColor === dataItem.id ? 'bg-dark text-light' : 'bg-white'}`}>
                                <div>
                                    <div className='fw-bold'>{handleMissingData(dataItem.username)}</div>
                                    <div>&nbsp;</div>
                                </div>
                                <div>
                                    <div className='fw-bold'>CONTACT</div>
                                    <div> {handleMissingData(dataItem.name)}</div>
                                </div>
                                <div>
                                    <div className='fw-bold'>CITY</div>
                                    <div>{handleMissingData(dataItem.address.city)}</div>
                                </div>
                                <div>
                                    <div className='fw-bold'>STATE</div>
                                    <div> {handleMissingData(dataItem.address.state)}</div>
                                </div>
                                <Button variant="primary" onClick={() => handleShowModal(dataItem)}>
                                    More. . .
                                </Button>
                            </div>
                        </div>
                    )) : <div className='btn btn-danger mx-5' onClick={e => window.location.reload(true)}>Data Not present here. Backend error</div>}</> : <div className='btn btn-secondary w-100 my-5' onClick={e => window.location.reload(true)}>Main Data Not present here. Click here to go Back to the first page</div>
                }
                {selectedUser && (
                    <Details
                        show={modalShow}
                        user={selectedUser}
                        onHide={() => setModalShow(false)}
                    />
                )}


            </div>
            <div class="navbar navbar-default navbar-fixed-bottom">
                <div class="container">
                    {filteredUsers.length <= 0 && <ReactPaginate
                        className='pagination w-50'
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={'pagination'}
                        previousLinkClassName={'page-link rounded  shadow fw-bold'}
                        nextLinkClassName={'page-link rounded shadow fw-bold'}
                        disabledClassName={'disabled'}
                        activeClassName={'active'}
                    />}
                </div>
            </div>

        </div>
    );
};

export default Homepage;
