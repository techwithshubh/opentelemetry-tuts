import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPMetricExporter, } from '@opentelemetry/exporter-metrics-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const initMetrics = (serviceName:string) => {
    const metricE = new OTLPMetricExporter({
        url: 'http://localhost:4318/v1/metrics'
    })

    const metricReader = new PeriodicExportingMetricReader({
        exporter: metricE,
        exportIntervalMillis: 1000,
    });

    const myServiceMeterProvider = new MeterProvider({
        resource: new Resource({
            [SEMRESATTRS_SERVICE_NAME]: serviceName,
        }),
        readers: [metricReader],
      });
    const meter = myServiceMeterProvider.getMeter(serviceName)
    return {meter}
}

export default initMetrics