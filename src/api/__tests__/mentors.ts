import { describe, expect, it } from '@jest/globals';
import { Mentor, sort } from '../mentors';

const mentors: Array<Mentor> = [
  {
    buddyId: 'abk3p_buddy_1',
    mentorId: 'mentor_1',
    age: 32,
    name: 'Foo',
    region: 'Helsinki',
    story: 'Bar baz bang',
    skills: ['Juggling', 'Belly dancing'],
    languages: [],
    is_vacationing: false,
    status_message: 'Status message',
    gender: 'Male',
    communication_channels: [],
  },
  {
    buddyId: 'dert_buddy_2',
    mentorId: 'mentor_2',
    age: 44,
    name: 'Hello',
    region: 'Tampere',
    story: 'Bingo bongo',
    skills: ['Wine tasting', 'Belly dancing'],
    languages: [],
    is_vacationing: false,
    status_message: 'Status message 2',
    gender: 'Female',
    communication_channels: [],
  },
  {
    buddyId: 'blarr_buddy_3',
    mentorId: 'mentor_3',
    age: 25,
    name: 'Asd',
    region: 'Kerava',
    story: 'Story is story',
    skills: ['Vim', 'Python'],
    languages: [],
    is_vacationing: true,
    status_message: 'Status message 3',
    gender: 'Male',
    communication_channels: [],
  },
  {
    buddyId: 'farg_buddy_4',
    mentorId: 'mentor_4',
    age: 65,
    name: 'Ding',
    region: 'Vantaaa',
    story: 'Lolwut hello',
    skills: ['Soccer'],
    languages: [],
    is_vacationing: false,
    status_message: 'Status message 4',
    gender: 'Male',
    communication_channels: [],
  },
  {
    buddyId: 'zing_buddy_5',
    mentorId: 'mentor_5',
    age: 22,
    name: 'Zen',
    region: 'Helsinki',
    story: 'Zen moimoi',
    skills: ['Meditation'],
    languages: [],
    is_vacationing: false,
    status_message: 'Status message 5',
    gender: 'Male',
    communication_channels: [],
  },
  {
    buddyId: 'whei_mentor_6',
    mentorId: 'mentor_6',
    age: 29,
    name: 'Whei',
    region: 'Rovaniemi',
    story: 'Brrlagrgdf',
    skills: ['Playstation'],
    languages: [],
    is_vacationing: true,
    status_message: 'Status message 6',
    gender: 'Female',
    communication_channels: [],
  },
];

describe('mentors sorting', () => {
  it('if user is mentor sorts users-profile as first item', () => {
    const sorted = sort(mentors[4].buddyId, mentors);

    expect(sorted[0].buddyId).toBe(mentors[4].buddyId);
  });

  it('returns all mentors if user is not mentor', () => {
    const sorted = sort('not_mentor', mentors);

    expect(sorted.length).toBe(mentors.length);
  });

  it('sorts vacationing mentors last', () => {
    const sorted = sort('not_mentor', mentors);

    expect(sorted[sorted.length - 1].is_vacationing).toBe(true);
    expect(sorted[0].is_vacationing).toBe(false);
  });

  it('sorts vacationing as first, if user is the mentor', () => {
    const sorted = sort(mentors[2].buddyId, mentors);

    expect(sorted[0].buddyId).toBe(mentors[2].buddyId);
    expect(sorted[0].is_vacationing).toBe(true);
    expect(sorted[sorted.length - 1].is_vacationing).toBe(true);
  });

  it('returns different results depending on users id', () => {
    const sorted1 = sort('lol', mentors);
    const sorted2 = sort('wut', mentors);

    expect(sorted1[0].buddyId).not.toBe(sorted2[0].buddyId);
  });

  it('sort does not mutate original list', () => {
    const copied = [...mentors];
    sort('not_mentor', mentors);
    expect(JSON.stringify(copied)).toBe(JSON.stringify(mentors));
  });
});
