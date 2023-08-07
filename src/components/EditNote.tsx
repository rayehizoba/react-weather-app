import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {preventDefault} from "../lib/helpers";
import Validator, {ValidationErrors} from "validatorjs";
import {useDispatch} from "react-redux";
import * as noteActions from '../store/note/note.actions';
import {NoteData, NoteResource} from "../lib/types";
import ValidationErrorMessages from "./ValidationErrorMessages";

interface EditNoteProps {
  note: null | NoteResource;

  onClose(): void;

  show: boolean;
}

function EditNote({show, onClose, note}: EditNoteProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<NoteData>({title: '', note: '',});

  const [formErrors, setFormErrors] = useState<null | ValidationErrors>(null);

  useEffect(() => {
    if (!show) return;
    if (note) {
      setFormData(note);
    } else {
      setFormData({title: '', note: '',});
    }
  }, [note, show]);

  function changedInput(field: string, value: string) {
    setFormData({...formData, [field]: value});
    setFormErrors(null);
  }

  function onSubmit() {
    const validation = new Validator(formData, {
      title: "required|max:100",
      note: "required|max:500",
    });

    if (validation.passes()) {
      setFormErrors(null);
      if (note) {
        dispatch(noteActions.editNote(note.id, formData));
      } else {
        dispatch(noteActions.createNote(formData));
      }
      onClose();
    } else {
      setFormErrors(validation.errors.all());
    }
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-600/50 backdrop-blur-lg transition"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <form
            onSubmit={preventDefault(onSubmit)}
            className="flex min-h-full items-center justify-center p-4 text-center"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-slate-900 shadow-xl transition-all">
                <div className="bg-slate-600/10 p-6 text-left align-middle">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6"
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder='Title'
                      value={formData.title}
                      onChange={(e) => changedInput('title', e.target.value)}
                      className='focus:outline-none bg-transparent w-full'
                    />
                    <ValidationErrorMessages name='title' errors={formErrors}/>
                  </Dialog.Title>
                  <div className="mt-5">
                    <textarea
                      value={formData.note}
                      onChange={(e) => changedInput('note', e.target.value)}
                      className="text-sm text-slate-400/75 w-full bg-transparent focus:outline-none"
                      placeholder='Note'
                      rows={4}
                    >
                    </textarea>
                    <ValidationErrorMessages name='note' errors={formErrors}/>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2.5">
                    <button
                      type='button'
                      onClick={onClose}
                      className='btn-outline p-2 !px-5'
                    >
                      <span className='font-medium text-sm text-slate-400'>Cancel</span>
                    </button>
                    <button type='submit' className='btn-primary p-2 !px-5'>
                      <span className='font-medium text-sm text-slate-400'>Save</span>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </form>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditNote;
