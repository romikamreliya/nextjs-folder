import { useState } from "react";

/**
 * Generic CRUD drawer and delete-modal state hook.
 * Handles: create drawer, edit drawer + selected item, view drawer + selected item, delete modal + selected item.
 *
 * @returns {{
 *   createDrawer: boolean, setCreateDrawer: Function,
 *   editDrawer: boolean, selectedItem: object|null, openEdit: Function, closeEdit: Function, setEditDrawer: Function,
 *   viewDrawer: boolean, selectedViewItem: object|null, openView: Function, closeView: Function, setViewDrawer: Function,
 *   deleteModal: boolean, selectedDeleteItem: object|null, openDelete: Function, closeDelete: Function
 * }}
 */
export function useCRUDDrawers() {
    const [createDrawer, setCreateDrawer] = useState(false);

    const [editDrawer, setEditDrawer] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [viewDrawer, setViewDrawer] = useState(false);
    const [selectedViewItem, setSelectedViewItem] = useState(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

    const openEdit = (item) => { setSelectedItem(item); setEditDrawer(true); };
    const closeEdit = () => { setEditDrawer(false); setSelectedItem(null); };

    const openView = (item) => { setSelectedViewItem(item); setViewDrawer(true); };
    const closeView = () => { setViewDrawer(false); setSelectedViewItem(null); };

    const openDelete = (item) => { setSelectedDeleteItem(item); setDeleteModal(true); };
    const closeDelete = () => { setDeleteModal(false); setSelectedDeleteItem(null); };

    return {
        createDrawer, setCreateDrawer,
        editDrawer, setEditDrawer, selectedItem, openEdit, closeEdit,
        viewDrawer, setViewDrawer, selectedViewItem, openView, closeView,
        deleteModal, selectedDeleteItem, openDelete, closeDelete,
    };
}
