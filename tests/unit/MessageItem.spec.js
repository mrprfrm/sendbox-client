import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { MessageItem } from '@/components';

describe('MessageItem.vue', () => {
  const message = {
    id: 'fa734aab-9a96-451e-92d5-c6fb7f999e59',
    body: 'Hi Admin! How are you doing?',
    user: {
      id: '918454ce-2d22-4ab2-b6ef-bb6df5801866',
      username: 'Mock',
    },
    publicatedAt: '01-02-0003T00:00',
    updatedAt: '',
  };

  it('check message text', () => {
    const store = createStore({
      state: () => ({ selectedMessageId: 'd65419a1-634f-4628-a75e-f297c78305b1' }),
    });
    const wrapper = mount(MessageItem, {
      props: { message },
      global: { plugins: [store] },
    });

    console.log(wrapper);

    expect(wrapper.html()).toContain('Hi Admin! How are you doing?');
  });
});
