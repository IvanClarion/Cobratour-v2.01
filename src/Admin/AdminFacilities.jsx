import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, updateDoc, addDoc, getDocs, query, deleteDoc, writeBatch, doc } from 'firebase/firestore';
import SearchIcon from './AdminIcons/search.svg';
import AddIcon from './AdminIcons/AdminAdd.svg';
import DeleteAll from './AdminIcons/AdminDelete.svg';
import AdminWarning from './AdminIcons/alarm3.png';
import Building from '../Client/Icons/building.svg';

function AdminFacilities() {
  const [facilities, setFacilities] = useState(['']);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [buildingName, setBuildingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [facilitiesList, setFacilitiesList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFacilities = async () => {
      const querySnapshot = await getDocs(collection(db, "Facilities"));
      const facilitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFacilitiesList(facilitiesData);
    };

    fetchFacilities();
  }, []);

  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = (e) => { if (e.target.id === 'warning-modal') setDeleteModal(false); };
  const openAddModal = () => { setAddModal(prev => !prev); }
  const openEditModal = (facility) => {
    setSelectedFacility(facility);
    setFacilities(facility.facilities);
    setBuildingName(facility.buildingName);
    setEditModal(true);
  };
  const closeEditModal = () => {
    setSelectedFacility(null);
    setFacilities(['']);
    setBuildingName('');
    setEditModal(false);
  };

  const addFacilityField = () => {
    setFacilities([...facilities, '']);
  };

  const handleFacilityChange = (index, event) => {
    const newFacilities = facilities.slice();
    newFacilities[index] = event.target.value;
    setFacilities(newFacilities);
  };

  const handleBuildingNameChange = (event) => {
    setBuildingName(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddFacilities = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "Facilities"), {
        buildingName,
        facilities
      });
      setBuildingName('');
      setFacilities(['']);
      setAddModal(false);
      // Fetch the updated facilities list
      const querySnapshot = await getDocs(collection(db, "Facilities"));
      const facilitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFacilitiesList(facilitiesData);
    } catch (error) {
      console.error("Error adding document to Firestore:", error);
      alert('Failed to add facilities to Firestore. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFacilities = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedFacility) {
        const facilityDoc = doc(db, "Facilities", selectedFacility.id);
        await updateDoc(facilityDoc, {
          buildingName,
          facilities
        });
        setSelectedFacility(null);
        setBuildingName('');
        setFacilities(['']);
        setEditModal(false);
        // Fetch the updated facilities list
        const querySnapshot = await getDocs(collection(db, "Facilities"));
        const facilitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFacilitiesList(facilitiesData);
      } else {
        alert('No facility selected for editing.');
      }
    } catch (error) {
      console.error("Error updating document in Firestore:", error);
      alert('Failed to update facilities in Firestore. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFacility = async () => {
    setLoading(true);

    try {
      await deleteDoc(doc(db, "Facilities", selectedFacility.id));
      setSelectedFacility(null);
      setBuildingName('');
      setFacilities(['']);
      setEditModal(false);
      // Fetch the updated facilities list
      const querySnapshot = await getDocs(collection(db, "Facilities"));
      const facilitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFacilitiesList(facilitiesData);
    } catch (error) {
      console.error("Error deleting document from Firestore:", error);
      alert('Failed to delete facility from Firestore. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllFacilities = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const facilitiesQuery = query(collection(db, "Facilities"));
      const querySnapshot = await getDocs(facilitiesQuery);
  
      if (querySnapshot.empty) {
        alert("No facilities to delete.");
        setLoading(false);
        return;
      }
  
      const batch = writeBatch(db); // Use writeBatch correctly
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit(); // Execute the batch operation
      setFacilitiesList([]); // Clear the list in the UI
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting all documents from Firestore:", error);
      alert('Failed to delete all facilities from Firestore. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = facilitiesList.filter(facility =>
    facility.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <section className='m-5'>
        <div className="flex flex-col lg:flex-row gap-5 items-stretch ">
          <label className="text-4xl font-semibold">Facilities</label>
          <span className="search-bar">
            <img src={SearchIcon} alt="Search Icon" className="w-8" />
            <input
              type="search"
              name="SearchBar"
              placeholder="Search"
              className='bg-transparent w-full outline-none'
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </span>
        </div>
        <section className="my-10 flex justify-center items-center gap-5">
          <button className="flex justify-center items-center button-content-container" onClick={openAddModal}>
            <img src={AddIcon} alt="Add" />
            <label className="font-medium">Add Content</label>
          </button>
          <button className="flex justify-center items-center button-content-container" onClick={openDeleteModal}>
            <img src={DeleteAll} alt="Delete All" />
            <label className="font-medium">Delete All Facilities</label>
          </button>
        </section>

        {/* Facilities Display List */}
        <section className='faci-list-section'>
          {filteredFacilities.map((facility) => (
            <div key={facility.id} className='faci-list-container' onClick={() => openEditModal(facility)}>
              <img src={Building} alt="" className='bg-maroon-custom p-1 rounded-full' />
              <label className='font-semibold text-xl'>{facility.buildingName}</label>
            </div>
          ))}
        </section>

        {/* Facilities Edit List Modal */}
        {editModal && (
          <section className='modal-section break-words'>
            <div className='faci-modal-container'>
              <article className='text-xl lg:text-3xl uppercase font-semibold '>
                <label>Edit Facilities</label>
              </article>
              <form onSubmit={handleEditFacilities}>
                <label>Building Name:</label>
                <input
                  type='text'
                  name='building name'
                  placeholder='Building Name'
                  value={buildingName}
                  onChange={handleBuildingNameChange}
                  required
                />
                <label>Facilities:</label>
                {facilities.map((facility, index) => (
                  <input
                    key={index}
                    type='text'
                    placeholder='Facilities Name'
                    value={facility}
                    onChange={(event) => handleFacilityChange(index, event)}
                    required
                  />
                ))}
                <div>
                <button type='button' onClick={addFacilityField} className='admin-filter-container-button text-white'>Add Facilities</button>
                </div>
                <span className='flex flex-row gap-3 items-stretch justify-between'>
                  <div className='flex gap-2'>
                    <button type='button' className='faci-button-remove' onClick={closeEditModal}>Cancel</button>
                    <button type='button' className='faci-button-remove' onClick={handleDeleteFacility}>Delete</button>
                  </div>
                  <button type='submit' className='faci-button-save'>Save</button>
                </span>
              </form>
            </div>
          </section>
        )}

        {/* Add Faci Modal */}
        {addModal && (
          <section className='modal-section'>
            <div className='faci-modal-container'>
              <article className='text-xl lg:text-3xl uppercase font-semibold '>
                <label>Add Facilities</label>
              </article>
              <form onSubmit={handleAddFacilities}>
                <label>Building Name:</label>
                <input
                  type='text'
                  name='building name'
                  placeholder='Building Name'
                  value={buildingName}
                  onChange={handleBuildingNameChange}
                  required
                />
                <label>Facilities:</label>
                {facilities.map((facility, index) => (
                  <input
                    key={index}
                    type='text'
                    placeholder='Facilities Name'
                    value={facility}
                    onChange={(event) => handleFacilityChange(index, event)}
                    required
                  />
                  
                ))}
                <div>
                <button type='button' onClick={addFacilityField} className='admin-filter-container-button text-white'>Add Facilities</button>
                </div>
                <span className='grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch justify-end'>
                  <button type='button' className='faci-button-remove' onClick={openAddModal}>Cancel</button>
                  <button type='submit' className='faci-button-save'>Save</button>
                </span>
              </form>
            </div>
          </section>
        )}

        {/* Delete Warning Modal */}
        {deleteModal && (
          <section id="warning-modal" className="modal-section" onClick={closeDeleteModal}>
            <div className="modal-content justify-center items-center w-w-90vw h-v-modal lg:size-3/5" onClick={(e) => e.stopPropagation()}>
              <span className="flex flex-col items-center">
                <img src={AdminWarning} alt="Warning" className="w-36" />
                <h1 className="font-bold text-2xl">WARNING!</h1>
                <label className='text-xs lg:text-base'>ARE YOU SURE TO CONTINUE THIS ACTION?</label>
                <form onSubmit={handleDeleteAllFacilities}>
                  <input type="submit" value="Continue" name="deleteAll" className="input-submit w-72" />
                </form>
              </span>
            </div>
          </section>
        )}
      </section>
    </>
  );
}

export default AdminFacilities;