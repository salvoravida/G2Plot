import { BulletOptions } from './types';

type TransformData = {
  min: number;
  max: number;
  ds: any[];
};
/**
 * bullet 处理数据
 * @param options
 */
export function transformData(options: BulletOptions): TransformData {
  const { data, xField, measureField, rangeField, targetField, layout } = options;
  const ds: any[] = [];
  const scales: number[] = [];
  data.forEach((item: any, index: number) => {
    // 构建 title * range
    const rangeFields = [item[rangeField]].flat();
    rangeFields.sort((a: number, b: number) => a - b);
    rangeFields.forEach((d: number, i: number) => {
      const range = i === 0 ? d : rangeFields[i] - rangeFields[i - 1];
      ds.push({
        rKey: rangeFields.length > 1 ? `${rangeField}_${i}` : `${rangeField}`, // 一个数据就不带索引了
        [xField]: xField ? item[xField] : String(index), // 没有xField就用索引
        [rangeField]: range,
      });
    });

    // 构建 title * measure
    const measureFields = [item[measureField]].flat();
    measureFields.forEach((d: number, i: number) => {
      ds.push({
        mKey: measureFields.length > 1 ? `${measureField}_${i}` : `${measureField}`, // 一个数据就不带索引了
        [xField]: xField ? item[xField] : String(index),
        [measureField]: d,
      });
    });

    // 构建 title * target
    const targetFields = [item[targetField]].flat();
    targetFields.sort((a: number, b: number) => a - b);
    targetFields.forEach((d: number, i: number) => {
      ds.push({
        tKey: targetFields.length > 1 ? `${targetField}_${i}` : `${targetField}`, // 一个数据就不带索引了
        [xField]: xField ? item[xField] : String(index),
        [targetField]: d,
      });
    });

    // 为了取最大值和最小值，先存储
    scales.push(item[rangeField], item[measureField], item[targetField]);
  });
  // scales 是嵌套的需要拍平
  let min = Math.min(...scales.flat(Infinity));
  const max = Math.max(...scales.flat(Infinity));
  // min 大于 0 从 0 开始
  min = min > 0 ? 0 : min;

  // 垂直情况，需要反转数据
  if (layout === 'vertical') {
    ds.reverse();
  }
  return { min, max, ds };
}
