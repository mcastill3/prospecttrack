import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ConversionResources = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recursos de Conversión</h2>      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table className="min-w-full border-collapse">
          <TableHeader className="bg-gray-900 text-white font-semibold">
            <TableRow>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Categoría</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Descripción</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Acción</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white divide-y divide-gray-200">
            {[
              { category: "Conversión", description: "Mejorar la conversión de leads." },
              { category: "Recursos Útiles", description: "Herramientas para la prospección." },
              { category: "Análisis & Optimización", description: "Análisis de datos." },
            ].map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-100 transition-all duration-200">
                <TableCell className="py-4 px-6 font-medium text-gray-900">{item.category}</TableCell>
                <TableCell className="py-4 px-6 text-gray-800">{item.description}</TableCell>
                <TableCell className="py-4 px-6">
                  <Button asChild variant="outline">
                    <Link href="http://localhost:3000/list/ciclos">Ver más</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ConversionResources;