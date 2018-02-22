import Note from '../models/note';
import Lane from '../models/lane';
import mongoose from 'mongoose';
import uuid from 'uuid';

export function addNote(req, res) {
	const { note, laneId } = req.body;

	if (!note || !note.task || !laneId) {
		res.status(400).end();
	}

	const newNote = new Note({
		task: note.task,
	});

	newNote.id = uuid();
	newNote.save((err, saved) => {
		if (err) {
			res.status(500).send(err);
		}
		Lane.findOne({ id: laneId })
			.then(lane => {
			lane.notes.push(saved);
			return lane.save();
			})
			.then(() => {
			res.json(saved);
			});
	});
}

export function deleteNote(req, res) {
	Note
	.findOne({ id: req.params.noteId })
	.exec((noteErr, note) => {
		if (noteErr) {
			res.status(500).send(noteErr);
		}

		Lane
		.findOne({ notes: { $in: [mongoose.Types.ObjectId(note._id)] } })
		.exec((laneErr, lane) => {
			if (laneErr) {
				res.status(500).send(laneErr);
			}

			lane
			.update(
				{ $pull: { notes: mongoose.Types.ObjectId(note._id) } },
				(updateErr) => {
					if (updateErr) {
						res.status(500).send(updateErr);
					}

					note.remove(() => {
						res.status(200).end();
					});
				}
			);
		});
	});
}

export function editNote(req, res) {
	if (!req.body.task) {
		res.status(400).end();
	}

	Note
	.findOneAndUpdate({ id: req.params.noteId }, { task: req.body.task }, { new: true }, (updateErr, updated) => {
		if (updateErr) {
			res.status(500).send(updateErr);
		}
		res.json(updated);
	});
}