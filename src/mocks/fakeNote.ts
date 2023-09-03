import {NoteResource} from "../lib/types";
import {faker} from "@faker-js/faker";

const fakeNote = (count: number = 1): NoteResource | NoteResource[] => {
  if (count === 1) {
    return {
      id: faker.string.uuid(),
      title: faker.internet.displayName(),
      note: faker.lorem.paragraph(),
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };
  }

  const notes: NoteResource[] = [];
  for (let i = 0; i < count; i++) {
    notes.push(fakeNote() as NoteResource);
  }

  return notes;
};

export default fakeNote;
