import { shallowMount } from '@vue/test-utils';
import { ChatRoom } from '@/views';
import store from '@/store';

function factory() {
  return shallowMount(ChatRoom, {
    global: { plugins: [store] },
  });
}

describe('New chat room rendering', () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => ({
      hasNext: false,
      data: [],
      count: 0,
    }),
  }));

  it('Chat room, user panel', () => {
    const wrapper = factory();
    expect(wrapper.find('.header__title').text()).toContain('Anon');
  });

  it('Chat room prev messages', () => {
    const wrapper = factory();
    expect(wrapper.find('.content__next-button').isVisible()).toBe(false);
  });
});
