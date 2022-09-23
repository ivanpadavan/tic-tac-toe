import { fireEvent, render } from '@testing-library/react';
import { range, sum } from '../../utils';
import { InfiniteField } from './Field';

const TestField = InfiniteField({
  throttle: 0,
  cmp: function SimpleCell(props) {
    return (
      <div>
        {props.x} {props.y}
      </div>
    );
  },
});

it('renders at least one cell and overflowCells describes additional circles', () => {
  const numOfCells = (overflowCells: number) => {
    return range(overflowCells + 1)
      .map((v) => {
        if (v === 0) return 1;
        const side = v * 2 + 1;
        return side * 4 - 4;
      })
      .reduce(sum);
  };
  for (let overflowCells = 0; overflowCells < 5; overflowCells++) {
    const { container } = render(
      <TestField
        overflowCells={overflowCells}
        xOffset={0}
        yOffset={0}
        cellSize={50}
      />
    );
    const received = container.querySelector('.container')!.children.length;
    const expected = numOfCells(overflowCells);
    expect(received).toEqual(expected);
  }
});
it('rerenders when resizes', () => {
  const { container } = render(
    <TestField overflowCells={0} xOffset={0} yOffset={0} cellSize={1} />
  );
  let side = 0;
  const square = () => ({ width: side, height: side });
  const numOfCells = () =>
    container.querySelector('.container')!.children.length;
  container.querySelector('.field')!.getBoundingClientRect = () =>
    square() as DOMRect;
  const results = [];
  while (side <= 10) {
    side++;
    fireEvent(window, new Event('resize'));
    results.push({ numOfCells: numOfCells(), side });
  }
  expect(results).toMatchSnapshot();
});
it('handles offsets', () => {
  const testOffsets = range(3).map((v) => v - 1);
  const results = testOffsets.flatMap((xOffset) =>
    testOffsets.map((yOffset) => {
      const { container } = render(
        <TestField
          overflowCells={1}
          xOffset={xOffset}
          yOffset={yOffset}
          cellSize={1}
        />
      );
      const nodeTexts = [
        ...container.querySelector('.container')!.children,
      ].map((it) => it.textContent);
      const rowLen = Math.sqrt(nodeTexts.length);
      const key = { xOffset, yOffset };
      const value =
        '\n' +
        range(rowLen)
          .map(
            () =>
              '(' +
              range(rowLen)
                .map(() => nodeTexts.shift())
                .join(') (') +
              ')'
          )
          .join('\n');
      return [key, value] as const;
    })
  );
  expect(new Map(results)).toMatchSnapshot();
});
