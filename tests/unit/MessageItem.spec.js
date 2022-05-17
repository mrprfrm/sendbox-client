import { shallowMount } from '@vue/test-utils';
import { MessageItem } from '@/components';

import store from '@/store';

function factory() {
  const message = {
    id: 'fa734aab-9a96-451e-92d5-c6fb7f999e59',
    body: 'Hi Admin! How are you doing?',
    user: {
      id: '918454ce-2d22-4ab2-b6ef-bb6df5801866',
      username: 'Mock',
    },
    publicatedAt: '2022-04-12T11:16:40.389000',
    updatedAt: null,
  };

  return shallowMount(MessageItem, {
    props: { message },
    global: { plugins: [store] },
  });
}

describe('MessageItem.vue', () => {
  it('check message text', () => {
    const wrapper = factory();
    expect(wrapper.find('.message__text').text()).toBe('Hi Admin! How are you doing?');
  });

  it('check message date', () => {
    // TODO mock TIME_OFFSET
    const wrapper = factory();
    expect(wrapper.find('.message__date').text()).toBe('14:16');
  });

  it('check publisher username', () => {
    const wrapper = factory();
    expect(wrapper.html()).toContain('Mock');
  });

  xit('check current user message', () => {
    const wrapper = factory();
    expect(wrapper.find('.message__username').text()).not.toBe('Mock');
  });
});
