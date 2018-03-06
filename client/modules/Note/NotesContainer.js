import { connect } from 'react-redux';
import Notes from './Notes';
import { deleteNoteRequest, editNote, updateNoteRequest } from '../Note/NoteActions';
import { moveWithinLane } from '../Lane/LaneActions';


const mapDispatchToProps = {
	editNote,
	updateNote: updateNoteRequest,
	deleteNote: deleteNoteRequest,
	moveWithinLane,
};

export default connect(
	null,
	mapDispatchToProps
)(Notes);